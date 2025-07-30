import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { TemplateCardComponent } from "../template-card/template-card";
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';

interface User {
  userId: number;  
  name: string,
  email: string;

}
interface Template {
  template_id: number;
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
@Component({
  selector: 'app-home',
  imports: [TemplateCardComponent,NgFor],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class HomeComponent implements OnInit {
scrollToTemplates(): void {
    const templateSection = document.getElementById('template-cards');
    if (templateSection) {
      templateSection.scrollIntoView({ behavior: 'smooth' });
    }
}
  templates: Template[] = [];
  userData: User | null = null;

  constructor(private router: Router, private http: HttpClient) {
    // Get user data from navigation state or localStorage
    this.userData = this.router.getCurrentNavigation()?.extras.state?.['user'] 
                  || JSON.parse(localStorage.getItem('user') || 'null');
  }



    ngOnInit(): void {
    if (this.userData?.userId) {
      this.fetchTemplates(this.userData.userId);
    } else {
      console.error('No user ID available');
      this.router.navigate(['/login']);
    }
  }

fetchTemplates(userId: number): void {
  console.log('Attempting to fetch for user ID:', userId); 

  this.http.get<any[]>(`http://localhost:8080/api/templates/by-user/${userId}`)
    .subscribe({
      next: (data) => {
        console.log('Templates loaded:', data);
        this.templates = data.map(template => ({
          template_id: template.templateId,
          template_name: template.templateName,
          field_count: template.fields.length,
          image_url: this.getPlaceholderImage(template.templateId),
          fields: template.fields
        }));
      },
      error: (err) => {
        console.error('Full error:', err);
        console.error('Error status:', err.status);
      }
    });
}
   private getPlaceholderImage(templateId: number): string {
    const colors = ['4a90e2', '50e3c2', 'e35050', 'b8e986', '7ed321', 'f5a623'];
    const colorIndex = templateId % colors.length;
    return `https://placehold.co/600x400/${colors[colorIndex]}/ffffff?text=Template+${templateId}`;
  }
navigateToDocument(templateId: number): void {
  this.router.navigate(['/document', { id: templateId, templateId: templateId }]);
  console.log('Navigating to document with template ID:', templateId);
}
  
}


