import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe, NgIf } from '@angular/common';
import { ApiKeyService } from '../../../service/apikey-service/apikey-service';
import { User } from '../../../model/template.model';
import { ApiKeySettings } from '../../../model/settings.model';
import { CustomToastService } from '../../../service/toast/custom-toast.service';
import { ModalService } from '../../../service/modal/modal-service';

@Component({
  selector: 'app-api-settings',
  imports: [FormsModule, HttpClientModule,DatePipe,NgIf],
  templateUrl: './api-settings.html',
  styleUrl: './api-settings.css'
})
export class ApiSettingsComponent implements OnInit {
  private apiService = inject(ApiKeyService);
  private router = inject(Router);

  userData: User | null = null;
  showApiKey = false;
  loading = false;
  minDate = new Date();

  settings = {
    aiModel: '',
    apiKey: '',
    expiryDate: null as string | null
  };
  constructor(
      private toast: CustomToastService,
       private modalService: ModalService
    ) {}
     
    resetForm() {
      this.modalService.show(
        'Confirm discard', 
        'Are you sure you want to discard changes?',
        () =>  this.loadApiKeySettings()
      );
    }

  ngOnInit(): void {
    this.userData = this.router.getCurrentNavigation()?.extras.state?.['user']
                 || JSON.parse(localStorage.getItem('user') || 'null');
    this.loadApiKeySettings();
  }

  loadApiKeySettings(): void {
    if (!this.userData?.userId) return;

    this.apiService.getApiKeySettings(this.userData.userId).subscribe({
      next: (data) => {
        this.settings = {
          aiModel: data.model,
          apiKey: data.apiKey,
          expiryDate: data.expiresAt 
            ? new Date(data.expiresAt).toISOString().split('T')[0] 
            : null
        };
      },
      error: (err) => {
         this.toast.show('Error loading API settings.', 'error');
        console.error('Error loading API settings:', err);
      }
    });
  }

  saveSettings(): void {
    if (!this.userData?.userId) return;
    this.loading = true;

    const payload: ApiKeySettings = {
      apiKey: this.settings.apiKey,
      model: this.settings.aiModel,
      expiresAt: this.settings.expiryDate 
        ? new Date(this.settings.expiryDate).toISOString() 
        : null
    };

    this.apiService.saveApiKey(this.userData.userId, payload).subscribe({
      next: () => {
        this.loading = false;
        this.toast.show('API settings saved successfully!', 'success');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error saving API settings:', err);
        this.toast.show('Failed to save API settings.', 'error');
      }
    });
  }

  

  onCancel(): void {
    this.router.navigate(['/home']);
  }
}