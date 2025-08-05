import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TemplateService } from '../../service/template-service/template-service';
import { User } from '../../model/template.model';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicfieldComponent } from '../../tools/dynamicfield-component/dynamicfield-component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomToastComponent } from '../../tools/CustomToastComponent/custom-toast-component/custom-toast-component';
import { CustomToastService } from '../../service/toast/custom-toast.service';

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
 showUrlInput: boolean = false;
errorMessage: string = '';
  private router = inject(Router);
  private templateService = inject(TemplateService);
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
  profilePictureUrl: string = '';
  profilePicturePath: string = 'images/profiles.png';

  constructor(private toast: CustomToastService) {}

  ngOnInit(): void {
    this.userData = this.router.getCurrentNavigation()?.extras.state?.['user'] 
                 || JSON.parse(localStorage.getItem('user') || 'null');
  }
handleImageError($event: ErrorEvent) {
throw new Error('Method not implemented.');
}
 toggleUrlInput() {
    this.showUrlInput = !this.showUrlInput;
    console.log('Input visibility toggled to:', this.showUrlInput); // Debug
  }
private modalService = inject(NgbModal);

// Update your update method
async updateProfilePicture(): Promise<void> {
  this.errorMessage = '';
  
  if (!this.profilePictureUrl?.trim()) {
    this.errorMessage = 'Please enter a valid URL';
    return;
  }

  try {
    new URL(this.profilePictureUrl);
    this.profilePicturePath = this.profilePictureUrl;
    // Close the modal programmatically
    this.modalService.dismissAll();
  } catch (e) {
    this.errorMessage = 'Please enter a valid URL (include http:// or https://)';
  }
}

// Add this method to open the modal
openImageUrlModal(content: any): void {
  this.profilePictureUrl = this.profilePicturePath === 'images/profiles.png' 
    ? '' 
    : this.profilePicturePath;
  this.errorMessage = '';
  this.modalService.open(content, { ariaLabelledBy: 'imageUrlModalLabel' });
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
      promt: componentData.promt,
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
       // In your component
      this.toast.show('Please enter a template name!', 'error');
      return;
    }

    if (this.formItems.length === 0) {
       this.toast.show('Please add at least one field to the template!', 'sad');
     
      return;
    }

    if (!this.userData?.userId) {
       this.toast.show('User information not available!', 'error');
      return;
    }

    this.isSaving = true;

    this.templateService.createTemplate(
      this.formName,
      this.documentType,
      this.profilePicturePath,
      this.userData.userId,
      this.formItems.map(item => ({
        label: item.label,
        promt:item.promt || item.label,
        type: item.type,
        required: item.required || false
      }))
    ).subscribe({
      next: (createdTemplate) => {
        console.log(createdTemplate);
         this.toast.show('Template created successfully!', 'success', 'bi-check-circle-fill');
    
        this.isSaving = false;
        // Optionally navigate to templates list or reset the form
        this.resetForm();
      },
      error: (err) => {
        console.error('Error creating template:', err);
        this.toast.show('This is a Custom Toast', 'error', 'bi-star-fill');
     
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