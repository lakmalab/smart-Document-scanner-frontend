import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Template } from '../../model/template.model';
import { ApiService } from '../api-service/api-service';

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
}
