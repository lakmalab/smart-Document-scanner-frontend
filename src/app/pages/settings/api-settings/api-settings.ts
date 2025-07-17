import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
interface User {
  userId: number;  
  name: string,
  email: string;

}
@Component({
  selector: 'app-api-settings',
  imports: [FormsModule, HttpClientModule],
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
    apiKey: ''
  };

  onSave() {
    console.log('API Settings Saved:', this.settings);
  }

  onCancel() {
    // Optional: clear or navigate
    console.log('Canceled');
  }
}
