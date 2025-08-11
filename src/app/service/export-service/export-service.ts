
import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api-service/api-service';


@Injectable({ providedIn: 'root' })
export class ExportService {
  private apiService = inject(ApiService);
  /**
   * Export all documents under a template ID as Excel (.xlsx)
   */
  exportTemplateAsExcel(templateId: number): void {
  this.apiService.postBlob(`api/export/template/${templateId}/xlsx`)
    .subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `template-${templateId}-export.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }
  exportTemplate(templateId: number, type: string, start: string, end: string, docStatus: string) {
  const params = { startDate: start, endDate: end };
  return this.apiService.postBlob(`api/export/template/${templateId}/${type}/${docStatus}`, params);
  }



}
