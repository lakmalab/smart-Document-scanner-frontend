import { Component, inject, OnInit } from '@angular/core';
import { TemplateCardComponent } from "../template-card/template-card";
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { TemplateService } from '../../service/template-service/template-service';
import { Template, User } from '../../model/template.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
  imports: [TemplateCardComponent, NgFor]
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private templateService = inject(TemplateService);

  templates: Template[] = [];
  userData: User | null = null;

  scrollToTemplates(): void {
    const templateSection = document.getElementById('template-cards');
    if (templateSection) {
      templateSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngOnInit(): void {
    this.userData = this.router.getCurrentNavigation()?.extras.state?.['user'] 
                 || JSON.parse(localStorage.getItem('user') || 'null');

    if (this.userData?.userId) {
      this.templateService.fetchTemplates(this.userData.userId).subscribe({
        next: (data) => {
          this.templates = data;
        },
        error: (err) => {
          console.error('Error fetching templates:', err);
        }
      });
    } else {
      console.error('No user ID available');
      this.router.navigate(['/login']);
    }
  }

  navigateToDocument(templateId: number): void {
  this.router.navigate(['/document', templateId]);
  }
  navigateToTemplateBuilder(): void {
  this.router.navigate(['/templatebuilder', this.userData?.userId]);

  }
}