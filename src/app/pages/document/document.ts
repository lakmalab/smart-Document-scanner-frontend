import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DocumentCard } from "../../tools/document-card/document-card";
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentService } from '../../service/document-service/document-service';
import { Template, User } from '../../model/template.model';
import { Document2, DocumentCardItem, ExtractedField } from '../../model/document.model';
import { TemplateService } from '../../service/template-service/template-service';

@Component({
  selector: 'app-document',
  imports: [NgFor, FormsModule, NgIf, DocumentCard],
  templateUrl: './document.html',
  styleUrls: ['./document.css']
})
export class DocumentComponent implements OnInit {
handleApprove(_t77: number) {
throw new Error('Method not implemented.');
}
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private docService = inject(DocumentService);
  private tempService = inject(TemplateService);
  userData: User | null = null;
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
        this.fields = template.fields.map(field => ({
          fieldId: field.fieldId,
          fieldName: field.fieldName,
          value: '',
          confidenceScore: 1.0,
          status: 'Pending'
        }));
      },
      error: (err) => console.error('Failed to load template:', err)
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
      error: (err) => console.error('Failed to load documents:', err)
    });
  }

  handleEdit(index: number): void {
    const doc = this.cardList[index];
    this.editingDocumentId = doc.documentId;
    this.submitted = false;
    this.fields = doc.fields.map(field => ({ ...field }));
  }

  handleDelete(index: number): void {
    const doc = this.cardList[index];
    this.docService.deleteDocument(doc.documentId).subscribe({
      next: () => {
        this.cardList.splice(index, 1);
        console.log('Deleted document:', doc.documentId);
      },
      error: (err) => console.error('Failed to delete document:', err)
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
      },
      error: (err) => {
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