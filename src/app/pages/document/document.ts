import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DocumentCard } from "../../tools/document-card/document-card";
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentService } from '../../service/document-service/document-service';
import { Template, User } from '../../model/template.model';
import { Document2, DocumentCardItem, ExtractedField } from '../../model/document.model';
import { TemplateService } from '../../service/template-service/template-service';
import { ExportService } from '../../service/export-service/export-service';
import { CustomToastService } from '../../service/toast/custom-toast.service';

@Component({
  selector: 'app-document',
  imports: [NgFor, FormsModule, NgIf, DocumentCard,NgClass],
  templateUrl: './document.html',
  styleUrls: ['./document.css']
})
export class DocumentComponent implements OnInit {
templateImage: any;
isExporting: boolean = false;
exportType: string = 'xlsx';
startDate: string = '';
endDate: string = '';
docStatus: string = 'reviewed'; 
dateRange: any;
sortField: any;
showExportModal:  boolean = false;

saveDraft() {
throw new Error('Method not implemented.');
}
handleApprove(_t77: number) {
throw new Error('Method not implemented.');
}
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private docService = inject(DocumentService);
  private tempService = inject(TemplateService);
  private exportService = inject(ExportService);
  userData: User | null = null;
  tempfields: Template[] = [];
  fields: ExtractedField[] = [];
  cardList: DocumentCardItem[] = [];
  editingDocumentId: number | null = null;

  searchQuery = '';
  selectedStatus = '';
  loading = false;
  submitted = false;
  templateName = '';
  isMobileConnected = false;
  scanMethod: String = '';
 constructor(
    private toast: CustomToastService
  ) {}
  ngOnInit(): void {
    this.userData = this.router.getCurrentNavigation()?.extras.state?.['user']
      || JSON.parse(localStorage.getItem('user') || 'null');

    if (!this.userData) return;

    this.loadTemplateAndFields();
    this.loadCardList();
  }

  private loadTemplateAndFields(): void {
    const templateId = Number(this.route.snapshot.paramMap.get('templateId'));
    this.tempService.getTemplate(templateId).subscribe({
      next: (template: Template) => {
        this.templateName = template.template_name || 'Document Form';
        this.fields = template.fields.map(fields => ({
          fieldId: fields.fieldId,
          fieldName: fields.fieldName,
          value: '',
          confidenceScore: 1.0,
          status:  "Pending",
          type: fields.fieldType
        }));
        this.tempfields = [template];
      },
      error: (err) =>{ console.error('Failed to load template:', err)
      this.toast.show('Failed to load template', 'error');}
    });
  }

  private loadCardList(): void {
    if (!this.userData) return;
    const id = this.userData.userId;
    const templateId = Number(this.route.snapshot.paramMap.get('templateId'));
    this.isMobileConnected = true;

    this.docService.getDocumentsByUser(id).subscribe({
      next: (docs: Document2[]) => {
        this.cardList = docs
          .filter(doc => doc.templateId === templateId && doc.extractedFields.length)
          .map(doc => ({
            documentId: doc.documentId,
            status: doc.status,
            uploadDate: doc.uploadDate,
            templateName: doc.templateName,
            fields: doc.extractedFields
          }));
      },
      error: (err) => {console.error('Failed to load documents:', err)
       this.toast.show('Failed to load documents', 'error');}
    });
  }

handleEdit(index: number): void {
  const doc = this.cardList[index];
  console.log('Editing document:', doc);

  this.editingDocumentId = doc.documentId;
  this.submitted = false;

  console.log('Template fields:', this.tempfields);

  this.fields = doc.fields.map(field => {
    console.log('Checking field:', field);

    const matchingTemplateField = this.tempfields.length
      ? this.tempfields[0].fields.find(
          tField => tField.fieldName === field.fieldName
        )
      : null;

    console.log('Matching template field:', matchingTemplateField);

    return {
      ...field,
      type: matchingTemplateField ? matchingTemplateField.fieldType : ''
    };
  });

  console.log('Mapped fields with type:', this.fields);
}



openExportModal(): void {
  this.showExportModal = true
  const modal = new (window as any).bootstrap.Modal(document.getElementById('exportModal'));
  modal.show();
}

confirmExport(): void {
  const templateId = Number(this.route.snapshot.paramMap.get('templateId'));

  if (!this.startDate || !this.endDate) {
    this.toast.show('Please select both start and end dates.', 'error');
  
    return;
  }

  this.isExporting = true;

  this.exportService.exportTemplate(templateId, this.exportType, this.startDate, this.endDate,this.docStatus)
    .subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `template-${templateId}-status.${this.docStatus}-export.${this.exportType}`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.isExporting = false;
        (window as any).bootstrap.Modal.getInstance(document.getElementById('exportModal')).hide();
      },
      error: () => {
        this.isExporting = false;
         this.toast.show('Export failed.', 'error');
     
      }
    });
}
  handleDelete(index: number): void {
    const doc = this.cardList[index];
    this.docService.deleteDocument(doc.documentId).subscribe({
      next: () => {
        this.cardList.splice(index, 1);
         this.toast.show('Document Deleted Successfully.', 'success');
        console.log('Deleted document:', doc.documentId);
      },
      error: (err) =>{ console.error('Failed to delete document:', err)
       this.toast.show('Failed to delete document.', 'error');}
    });
  }

  onSubmit(): void {
    const payload = {
      documentId: this.editingDocumentId,
      extractedFields: this.fields.map(f => ({ fieldId: f.fieldId, value: f.value }))
    };

    this.loading = true;
    this.submitted = false;

    const request = this.editingDocumentId
      ? this.docService.updateDocument(this.editingDocumentId, payload.extractedFields)
      : this.docService.createDocument(payload.extractedFields);

    request.subscribe({
      next: (res) => {
        console.log(this.editingDocumentId ? 'Updated:' : 'Created:', res);
        this.editingDocumentId = null;
        this.fields.forEach(f => f.value = '');
        this.loadCardList();
        this.submitted = true;
        this.loading = false;
         this.toast.show('Document Updated.', 'success');
      },
      error: (err) => {
         this.toast.show('Failed to submit document.', 'error');
        console.error('Failed to submit document:', err);
        this.loading = false;
      }
    });
  }

  filteredDocs(): DocumentCardItem[] {
    let filtered = this.cardList;

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.templateName.toLowerCase().includes(query) ||
        doc.fields.some(f =>
          f.fieldName.toLowerCase().includes(query) ||
          f.value?.toLowerCase().includes(query)
        )
      );
    }

    if (this.selectedStatus) {
      filtered = filtered.filter(doc => doc.status.toLowerCase() === this.selectedStatus.toLowerCase());
    }

    return filtered;
  }
}