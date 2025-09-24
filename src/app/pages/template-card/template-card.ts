
import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output  } from '@angular/core';
import { TemplateService } from '../../service/template-service/template-service';
import { ModalService } from '../../service/modal/modal-service';
import { Button } from "primeng/button";


@Component({
  selector: 'app-template-card',
  imports: [NgIf, NgFor, HttpClientModule],
  templateUrl: './template-card.html',
  styleUrl: './template-card.css'
})
export class TemplateCardComponent {
    private modalService: ModalService = inject(ModalService);
    lastUpdated: any;
  onDelete() {
    this.modalService.show(
      'Confirm Delete', 
      'Are you sure you want to delete this template?',
      () => this.confirmDelete() 
    );
  }
  private tempService = inject(TemplateService);
 isDropdownOpen: boolean = false;
 toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

  onEdit(): void {
     this.editTemplate.emit(this.template.templateId);
    this.isDropdownOpen = false; // Close dropdown after selection
  }


getImageUrl() {
  return this.template.image_url || 'https://via.placeholder.com/300x200';
}

  @Input() template: any; // Adjust type as necessary
  @Output() useTemplate = new EventEmitter<number>();
  @Output() editTemplate = new EventEmitter<number>();
  onUseTemplate(): void {
    this.useTemplate.emit(this.template.templateId);
   
console.log('template:', this.template);
  }
  
confirmDelete(): void {
    this.tempService.deleteTemplate(this.template.templateId).subscribe({
        next: (response) => {
            console.log('Template deleted successfully:', response);
            this.modalService.hide();
            this.isDropdownOpen = false; 
             window.location.reload();
        },
        error: (err) => {
          this.modalService.hide();
            console.error('Error deleting template:', err);
        }
    });

    console.log('Delete clicked');
    this.isDropdownOpen = false; 
}
}
