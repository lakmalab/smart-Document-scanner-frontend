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
 subscribeToDocumentEvents(): Observable<any> {
  return new Observable((observer) => {
    const eventSource = new EventSource(`${this.api.getBaseUrl()}/api/documents/subscribe`);

    eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        observer.next({ type: 'message', data: message });
      } catch (err) {
        console.error('Error parsing SSE message', err);
      }
    };

    eventSource.addEventListener('documentCreated', (event: MessageEvent) => {
      observer.next({ type: 'documentCreated', data: JSON.parse(event.data) });
    });

    eventSource.addEventListener('documentsUpdate', (event: MessageEvent) => {
      observer.next({ type: 'documentsUpdate', data: JSON.parse(event.data) });
    });

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
      observer.error(error);
    };

    // Cleanup
    return () => {
      eventSource.close();
    };
  });
}




}
