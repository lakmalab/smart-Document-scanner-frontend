import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DocumentCard } from "../../tools/document-card/document-card";
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

interface Template {
  templateId: number;
  template_name: string;
  field_count: number;
  image_url: string;
  fields: {
    fieldId: number;
    fieldName: string;
    fieldType: string;
    required: boolean;
  }[];
}
interface ExtractedField {
  fieldId: number;
  fieldName: string;
  value: string;
  confidenceScore: number;
}
interface User {
  userId: number;  
  name: string,
  email: string;
}
interface Document2 {
  documentId: number;
  status: string;
  uploadDate: string;
  uploadedByUserId: number;
  templateId: number;
  templateName: string;
  extractedFields: ExtractedField[];
}

interface DocumentCardItem {
  documentId: number;
  status: string;
  uploadDate: string;
  templateName: string;
  fields: ExtractedField[];
}

@Component({
  selector: 'app-document',
  imports: [NgFor, FormsModule, NgIf, DocumentCard],
  templateUrl: './document.html',
  styleUrls: ['./document.css']
})
export class Document implements OnInit {
  editingDocumentId: number | null = null;

  fields: ExtractedField[] = [];
  cardList: DocumentCardItem[] = [];
  isMobileConnected: any;
  scanMethod: any;
  searchQuery: any;

  userData: User | null = null;
      constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {
    
      this.userData = this.router.getCurrentNavigation()?.extras.state?.['user'] 
                    || JSON.parse(localStorage.getItem('user') || 'null');
    }
    

  ngOnInit(): void {
     const selectedTemplateId = Number(this.route.snapshot.paramMap.get('templateId'));
  console.log('Captured Template ID:', selectedTemplateId); 
    if (!this.userData) return;

   
 this.http.get<Template>(`http://localhost:8080/api/templates/${selectedTemplateId}`)
  .subscribe({
    next: (template) => {
      console.log('Template Response:', template);
      if (template?.fields?.length) {
        this.fields = template.fields.map(field => ({
          fieldId: field.fieldId,
          fieldName: field.fieldName,
          value: '', // initialize value for input binding
          confidenceScore: 1.0 // default value
        }));
        console.log('Initialized Fields:', this.fields);
      } else {
        console.warn(`No fields found in template ID: ${selectedTemplateId}`);
      }
    },
    error: (err) => {
      console.error('Failed to load template:', err);
    }
  });

 const id = this.userData.userId;

   this.http.get<Document2[]>(`http://localhost:8080/api/documents/by-user/${id}`)
  .subscribe({
    next: (docs) => {
      const matchingDocs = docs.filter(doc =>
        doc.templateId === selectedTemplateId &&
        doc.extractedFields?.length > 0
      );

      // Each card will represent one document with its fields inside
      this.cardList = matchingDocs.map(doc => ({
        documentId: doc.documentId,
        status: doc.status,
        uploadDate: doc.uploadDate,
        templateName: doc.templateName,
        fields: doc.extractedFields
      }));
    },
    error: (err) => {
      console.error('Failed to load documents:', err);
    }
  });


}
handleApprove(_t54: number) {
throw new Error('Method not implemented.');
}
handleEdit(index: number) {
  const doc = this.cardList[index];
  this.editingDocumentId = doc.documentId;

  // Set this.fields with values from the selected document for editing
  this.fields = doc.fields.map(field => ({
    fieldId: field.fieldId,
    fieldName: field.fieldName,
    value: field.value,
    confidenceScore: field.confidenceScore
  }));

  console.log('Editing document ID:', this.editingDocumentId);
  console.log('Loaded fields into form for editing:', this.fields);
}

// Each doc in this.cardList should be of shape:
// { documentId, templateName, uploadDate, status, fields: ExtractedField[] }

filteredDocs() {
  if (!this.searchQuery) return this.cardList;

  const query = this.searchQuery.toLowerCase();
  return this.cardList.filter(doc =>
    doc.templateName?.toLowerCase().includes(query) ||
    doc.fields?.some(f =>
      f.fieldName.toLowerCase().includes(query) ||
      f.value?.toLowerCase().includes(query)
    )
  );
}


handleDelete(_t54: number) {
throw new Error('Method not implemented.');
}
filterehandleDeletedDocs(_t54: number) {
throw new Error('Method not implemented.');
}

submitForm() {
  const payload = {
    documentId: this.editingDocumentId,
    extractedFields: this.fields.map(field => ({
      fieldId: field.fieldId,
      value: field.value
    }))
  };

  console.log('Submit Payload:', payload);

  if (this.editingDocumentId) {
    this.http.put(`http://localhost:8080/api/documents/${this.editingDocumentId}`, payload)
      .subscribe({
        next: res => {
          console.log('Document updated:', res);
          this.editingDocumentId = null;
        },
        error: err => {
          console.error('Failed to update document:', err);
        }
      });
  } else {
    // POST for new document, if applicable
  }
}}
