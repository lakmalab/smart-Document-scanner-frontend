import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TemplateService } from '../../service/template-service/template-service';
import { User } from '../../model/template.model';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicfieldComponent } from '../../tools/dynamicfield-component/dynamicfield-component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-template-builder',
  standalone: true,
  imports: [NgIf, FormsModule, NgFor, DynamicfieldComponent],
  templateUrl: './template-builder.html',
  styleUrl: './template-builder.css'
})
export class TemplateBuilder implements OnInit {
  formName: string = '';
  documentType: string = 'Form'; // Default document type
  formImage: string | null = null;
  selectedItemIndex: number | null = null;
  isSaving: boolean = false;

  private router = inject(Router);
  private templateService = inject(TemplateService);
  private toastr = inject(ToastrService);

  components = [
    { type: 'text', name: 'Text Field', icon: 'bi bi-input-cursor-text' },
    { type: 'textarea', name: 'Text Area', icon: 'bi bi-text-paragraph' },
    { type: 'date', name: 'Date Picker', icon: 'bi bi-calendar' },
    { type: 'select', name: 'Dropdown', icon: 'bi bi-menu-down' },
    { type: 'checkbox', name: 'Checkbox', icon: 'bi bi-check-square' },
    { type: 'radio', name: 'Radio Button', icon: 'bi bi-ui-radios' },
    { type: 'label', name: 'Label', icon: 'bi bi-tag' },
    { type: 'button', name: 'Button', icon: 'bi bi-button' }
  ];

  documentTypes: string[] = ['Form', 'Certificate', 'Contract', 'Application', 'Report'];
  formItems: any[] = [];
  userData: User | null = null;

  constructor() {}

  ngOnInit(): void {
    this.userData = this.router.getCurrentNavigation()?.extras.state?.['user'] 
                 || JSON.parse(localStorage.getItem('user') || 'null');
  }

  handleImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  dragStart(event: DragEvent, component: any): void {
    event.dataTransfer?.setData('text/plain', JSON.stringify(component));
  }
  
  dragOver(event: DragEvent): void {
    event.preventDefault();
  }
  
  drop(event: DragEvent): void {
    event.preventDefault();
    const componentData = JSON.parse(event.dataTransfer?.getData('text/plain') || '{}');
    
    const newItem = {
      type: componentData.type,
      label: componentData.name,
      placeholder: '',
      required: false
    };
    
    this.formItems.push(newItem);
  }
  
  selectItem(index: number): void {
    this.selectedItemIndex = index;
  }
  
  removeItem(index: number): void {
    this.formItems.splice(index, 1);
    if (this.selectedItemIndex === index) {
      this.selectedItemIndex = null;
    }
  }

  saveTemplate(): void {
    if (!this.formName) {
      (this.toastr as ToastrService).error('Please enter a template name');
      return;
    }

    if (this.formItems.length === 0) {
      (this.toastr as ToastrService).error('Please add at least one field to the template');
      return;
    }

    if (!this.userData?.userId) {
      (this.toastr as ToastrService).error('User information not available');
      return;
    }

    this.isSaving = true;

    this.templateService.createTemplate(
      this.formName,
      this.documentType,
      this.userData.userId,
      this.formItems.map(item => ({
        label: item.label,
        type: item.type,
        required: item.required || false
      }))
    ).subscribe({
      next: (createdTemplate) => {
        (this.toastr as ToastrService).success('Template created successfully');
        this.isSaving = false;
        // Optionally navigate to templates list or reset the form
        this.resetForm();
      },
      error: (err) => {
        console.error('Error creating template:', err);
        (this.toastr as ToastrService).error('Failed to create template');
        this.isSaving = false;
      }
    });
  }

  private resetForm(): void {
    this.formName = '';
    this.documentType = 'Form';
    this.formItems = [];
    this.formImage = null;
    this.selectedItemIndex = null;
  }

  // Add this method to toggle required field
  toggleRequired(index: number): void {
    if (this.formItems[index]) {
      this.formItems[index].required = !this.formItems[index].required;
    }
  }
}