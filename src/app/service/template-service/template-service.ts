import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Template } from '../../model/template.model';
import { ApiService } from '../api-service/api-service';

// Define the TemplateCreateRequest interface
interface TemplateCreateRequest {
  templateId: number | null;
  templateName: string;
  documentType: string;
  createdByUserId: number;
  fields: {
    fieldName: string;
    fieldType: string;
    required: boolean;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private api = inject(ApiService);

  fetchTemplates(userId: number): Observable<Template[]> {
    return this.api.get<any[]>(`api/templates/by-user/${userId}`).pipe(
      map(templates => templates.map(template => ({
        templateId: template.templateId,
        template_name: template.templateName,
        field_count: template.fields.length,
        image_url: this.getPlaceholderImage(template.templateId),
        fields: template.fields
      })))
    );
  }

  getTemplate(templateId: number): Observable<Template> {
    return this.api.get<Template>(`api/templates/${templateId}`);
  }

  private getPlaceholderImage(templateId: number): string {
    const colors = ['4a90e2', '50e3c2', 'e35050', 'b8e986', '7ed321', 'f5a623'];
    const colorIndex = templateId % colors.length;
    return `https://placehold.co/600x400/${colors[colorIndex]}/ffffff?text=Template+${templateId}`;
  }
   createTemplate(
    templateName: string,
    documentType: string,
    userId: number,
    fields: { label: string; type: string; required: boolean }[]
  ): Observable<Template> {
    const request: TemplateCreateRequest = {
      templateId: null,
      templateName: templateName,
      documentType: documentType,
      createdByUserId: userId,
      fields: fields.map(field => ({
        fieldName: field.label,
        fieldType: this.mapFieldType(field.type),
        required: field.required
      }))
    };

    return this.api.post<Template>('api/templates', request);
  }

  private mapFieldType(uiType: string): string {
    // Map UI field types to backend field types
    const typeMap: { [key: string]: string } = {
      'text': 'String',
      'textarea': 'String',
      'date': 'Date',
      'select': 'String',
      'checkbox': 'Boolean',
      'radio': 'String',
      'number': 'Number'
    };
    return typeMap[uiType] || 'String';
  }

}
