import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, output } from '@angular/core';

@Component({
  selector: 'app-document-card',
  imports: [NgFor, NgClass,NgIf],
  templateUrl: './document-card.html',
  styleUrl: './document-card.css'
})
export class DocumentCard {
 @Input() document!: {
  documentId: number;
  templateName: string;
  uploadDate: string;
  status: string;
  fields: {
    fieldId: number;
    fieldName: string;
    status: string;
    value: string;
    confidenceScore: number;
  }[];
};
  @Output() onEdit = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();
  @Output() onApprove = new EventEmitter<void>();
    isExpanded = false;
      toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

}
