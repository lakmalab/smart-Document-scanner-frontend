import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
interface User {
  userId: number;  
  name: string,
  email: string;
}
interface ApiKeySettings {
  apiKey: string;
  model: string;
  expiresAt: string | null;
}
@Component({
  selector: 'app-api-settings',
  imports: [FormsModule, HttpClientModule,DatePipe],
  templateUrl: './api-settings.html',
  styleUrl: './api-settings.css'
})
export class ApiSettings {
   userData: User | null = null;
    constructor(private router: Router, private http: HttpClient) {
    // Get user data from navigation state or localStorage
    this.userData = this.router.getCurrentNavigation()?.extras.state?.['user'] 
                  || JSON.parse(localStorage.getItem('user') || 'null');
  }
  
   
  settings = {
    aiModel: '',
    apiKey: '',
    expiryDate: null as string | null
  };
  minDate = new Date();
  loading = false;
  ngOnInit() {
    this.loadApiKeySettings();
  }
showApiKey: boolean = false;

  loadApiKeySettings() {
    if (this.userData?.userId) {
      this.http.get<ApiKeySettings>(`http://localhost:8080/api/users/${this.userData.userId}`)
        .subscribe({
          next: (data) => {
            this.settings = {
              aiModel: data.model,
              apiKey: data.apiKey,
              expiryDate: data.expiresAt ? new Date(data.expiresAt).toISOString().split('T')[0] : null
            };
          },
          error: (err) => {
            console.error('Error loading API settings:', err);
          }
        });
    }
  }

  saveSettings() {
    if (!this.userData?.userId) return;

    this.loading = true;
    
    const apiKeyData: ApiKeySettings = {
      apiKey: this.settings.apiKey,
      model: this.settings.aiModel,
      expiresAt: this.settings.expiryDate 
        ? new Date(this.settings.expiryDate).toISOString() 
        : null
    };

    this.http.post(
      `http://localhost:8080/auth/add-apikey/${this.userData.userId}`,
      apiKeyData
    ).subscribe({
      next: () => {
        this.loading = false;
        alert('API settings saved successfully!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error saving API settings:', err);
        alert('Failed to save API settings');
      }
    });
  }

  resetForm() {
    const confirmReset = confirm('Are you sure you want to discard changes?');
    if (confirmReset) {
      this.loadApiKeySettings(); // Reload original settings
    }
  }

  onCancel() {
    this.router.navigate(['/home']);
  }
}