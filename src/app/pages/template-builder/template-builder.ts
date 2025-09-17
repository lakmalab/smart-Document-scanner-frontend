import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateService } from '../../service/template-service/template-service';
import {
  Template,
  TemplateCreateRequest,
  User,
} from '../../model/template.model';
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
  styleUrl: './template-builder.css',
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
    { type: 'button', name: 'Button', icon: 'bi bi-button' },
  ];

  documentTypes: string[] = [
    'Form',
    'Certificate',
    'Contract',
    'Application',
    'Report',
  ];
  formItems: any[] = [];
  userData: User | null = null;
  profilePictureUrl: string = '';
  profilePicturePath: string = 'images/profiles.png';

  templateId: number | null = null;
  isEditMode: boolean = false;

  constructor(
    private toast: CustomToastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userData =
      this.router.getCurrentNavigation()?.extras.state?.['user'] ||
      JSON.parse(localStorage.getItem('user') || 'null');

    // Check for template ID in route
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.templateId = parseInt(id, 10); // Parse the ID if it's not null
        console.log('Template ID:', this.templateId);
      } else {
        console.error('Template ID is missing');
        // Handle the case where the ID is not present
      }

      this.isEditMode = !!this.templateId;
      if (this.templateId) {
        this.loadTemplate(this.templateId);
      }
    });
  }
  private modalService = inject(NgbModal);
  private loadTemplate(templateId: number): void {
    this.templateService.getTemplate(templateId).subscribe({
      next: (template) => {
        console.log(template);

        this.formName = template.templateName;

        this.profilePicturePath =
          template.templateImagePath || 'images/profiles.png';

        // Map the API fields to your formItems structure
        this.formItems = template.fields.map((field: any) => {
          // Map fieldType to match your component types
          let fieldType = field.fieldType.toLowerCase();
          if (fieldType === 'string') fieldType = 'text';

          return {
            type: fieldType,
            label: field.fieldName,
            promt: field.aiPrompt || field.fieldName, // Use AI prompt if available
            placeholder: '',
            required: field.required || false,
          };
        });

        console.log('Mapped form items:', this.formItems); // Debug log
      },
      error: (err) => {
        console.error('Error loading template:', err);
        this.toast.show('Failed to load template', 'error');
      },
    });
  }
  handleImageError($event: ErrorEvent) {
    throw new Error('Method not implemented.');
  }
  toggleUrlInput() {
    this.showUrlInput = !this.showUrlInput;
    console.log('Input visibility toggled to:', this.showUrlInput); // Debug
  }

  async updateProfilePicture(): Promise<void> {
    this.errorMessage = '';

    if (!this.profilePictureUrl?.trim()) {
      this.errorMessage = 'Please enter a valid URL';
      return;
    }

    try {
      new URL(this.profilePictureUrl);
      this.profilePicturePath = this.profilePictureUrl;
      this.modalService.dismissAll();
    } catch (e) {
      this.errorMessage =
        'Please enter a valid URL (include http:// or https://)';
    }
  }
  private mapFieldType(uiType: string): string {
    switch (uiType) {
      case 'date':
        return 'date';
      case 'checkbox':
        return 'boolean';
      default:
        return 'string';
    }
  }
  // Add this method to open the modal
  openImageUrlModal(content: any): void {
    this.profilePictureUrl =
      this.profilePicturePath === 'images/profiles.png'
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
    const componentData = JSON.parse(
      event.dataTransfer?.getData('text/plain') || '{}'
    );

    const newItem = {
      type: componentData.type,
      label: componentData.name,
      promt: componentData.promt,
      placeholder: '',
      required: false,
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
  updateTemplate(): void {
    if (!this.formName) {
      this.toast.show('Please enter a template name!', 'error');
      return;
    }

    if (this.formItems.length === 0) {
      this.toast.show('Please add at least one field to the template!', 'sad');
      return;
    }

    if (!this.userData?.userId || !this.templateId) {
      this.toast.show('Invalid template or user information!', 'error');
      return;
    }

    this.isSaving = true;

    // Payload matches backend expectation
    const updateData: TemplateCreateRequest = {
      templateId: this.templateId,
      templateName: this.formName,
      templateImagePath: this.profilePicturePath,
      documentType: this.documentType, // Add field count
      createdByUserId: this.userData.userId, // Add image_url (use empty string if not available)
      fields: this.formItems.map((item) => ({
        fieldId: item.fieldId || 0, // Use 0 as default if fieldId is null/undefined
        fieldName: item.label,
        fieldType: this.mapComponentTypeToApiType(item.type),
        required: item.required || false,
        aiPrompt: item.promt || item.label,
      })),
    };

    this.templateService.updateTemplate(this.templateId, updateData).subscribe({
      next: () => {
        this.toast.show(
          'Template updated successfully!',
          'success',
          'bi-check-circle-fill'
        );
        this.isSaving = false;
      },
      error: (err) => {
        console.error('Error updating template:', err);
        this.toast.show('Failed to update template', 'error');
        this.isSaving = false;
      },
    });
  }

  // Map UI component types to backend-friendly field types
  mapComponentTypeToApiType(type: string): string {
    switch (type) {
      case 'text':
        return 'string';
      case 'textarea':
        return 'string';
      case 'date':
        return 'date';
      case 'checkbox':
        return 'boolean';
      case 'radio':
        return 'string';
      case 'select':
        return 'string';
      case 'label':
        return 'string';
      case 'button':
        return 'string';
      default:
        return 'string';
    }
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

    this.templateService
      .createTemplate(
        this.formName,
        this.documentType,
        this.profilePicturePath,
        this.userData.userId,
        this.formItems.map((item) => ({
          label: item.label,
          promt: item.promt || item.label,
          type: item.type,
          required: item.required || false,
        }))
      )
      .subscribe({
        next: (createdTemplate) => {
          console.log(createdTemplate);
          this.toast.show(
            'Template created successfully!',
            'success',
            'bi-check-circle-fill'
          );

          this.isSaving = false;
          // Optionally navigate to templates list or reset the form
          this.resetForm();
        },
        error: (err) => {
          console.error('Error creating template:', err);
          this.toast.show('This is a Custom Toast', 'error', 'bi-star-fill');

          this.isSaving = false;
        },
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
