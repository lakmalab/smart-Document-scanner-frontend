// custom-toast-component.ts
import { Component, Input, TemplateRef } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-custom-toast',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './custom-toast-component.html',
  styleUrls: ['./custom-toast-component.css']
})
export class CustomToastComponent {
  @Input() message: string = '';
  @Input() type: 'info' | 'success' | 'warning' | 'error' | 'happy' | 'sad' | 'save' | 'delete' | 'confuse' = 'info';
  @Input() icon: string = '';
  @Input() duration: number = 5000; // Default 5 seconds
  showToast: boolean = true;

  // Icon mappings for each type
  private iconMap = {
    info: 'bi-info-circle',
    success: 'bi-check-circle',
    warning: 'bi-exclamation-triangle',
    error: 'bi-x-circle',
    happy: 'bi-emoji-smile',
    sad: 'bi-emoji-frown',
    save: 'bi-save',
    delete: 'bi-trash',
    confuse: 'bi-question-circle'
  };

  ngOnInit() {
    // Set default icon if none provided
    if (!this.icon) {
      this.icon = this.iconMap[this.type];
    }

    // Auto-hide after duration
    if (this.duration > 0) {
      setTimeout(() => this.close(), this.duration);
    }
  }

  close() {
    this.showToast = false;
  }

  // Static method to show toast (alternative approach)
  static show(message: string, type: string, icon?: string): CustomToastComponent {
    // In a real implementation, this would need a service to manage multiple toasts
    const toast = new CustomToastComponent();
    toast.message = message;
    toast.type = type as any;
    toast.icon = icon || '';
    return toast;
  }
}