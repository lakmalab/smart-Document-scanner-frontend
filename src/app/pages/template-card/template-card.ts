
import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, Output  } from '@angular/core';


@Component({
  selector: 'app-template-card',
  imports: [NgIf,NgFor,HttpClientModule],
  templateUrl: './template-card.html',
  styleUrl: './template-card.css'
})
export class TemplateCardComponent {
getImageUrl() {
  return this.template.image_url || 'https://via.placeholder.com/300x200';
}

@Input() template: any; // Adjust type as necessary
  @Output() useTemplate = new EventEmitter<number>();

  onUseTemplate(): void {
    this.useTemplate.emit(this.template.templateId);
   
console.log('template:', this.template);
  }
  
}
