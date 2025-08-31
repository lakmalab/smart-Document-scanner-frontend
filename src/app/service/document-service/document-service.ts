import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api-service/api-service';
import { Document2 } from '../../model/document.model';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private api = inject(ApiService);

  getDocumentsByUser(userId: number): Observable<Document2[]> {
    return this.api.get<Document2[]>(`api/documents/by-user/${userId}`);
  }

  deleteDocument(docId: number): Observable<void> {
    return this.api.delete<void>(`api/documents/${docId}`);
  }

  createDocument(
    fields: { fieldId: number; value: string }[]
  ): Observable<any> {
    return this.api.post('api/documents', { extractedFields: fields });
  }

  updateDocument(
    documentId: number,
    fields: { fieldId: number; value: string }[]
  ): Observable<any> {
    return this.api.put(`api/documents/${documentId}`, {
      documentId,
      extractedFields: fields,
    });
  }
}
