import { NgClass, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
interface MobileTokenSettings {
  token: string;
  used: boolean;
  expiresAt: string | null;
}
interface User {
  userId: number;
  name: string;
  email: string;
}
@Component({
  selector: 'app-mobile-token',
  imports: [NgIf,FormsModule,HttpClientModule,DatePipe,NgClass],
  templateUrl:'./mobile-token.html',
  styleUrl: './mobile-token.css'
})

export class MobileToken {
userData: User | null = null;
    constructor(private router: Router, private http: HttpClient) {
  
    this.userData = this.router.getCurrentNavigation()?.extras.state?.['user'] 
                  || JSON.parse(localStorage.getItem('user') || 'null');
  }
    settings = {
    used: false,
    token: '',
    expiresAt: null as string | null
  };
   qrCode: string | null = null;
  minDate = new Date();
  loading = false;
  
ngOnInit(): void {
    if (!this.userData) return;

    const id = this.userData.userId;

    this.loadToken(id);
    this.loadQRCode(id);

    // Poll every 5 seconds to auto-refresh 'used' status
    setInterval(() => {
      this.loadToken(id);
    }, 5000);
  }

  loadToken(id: number): void {
    this.http.get<MobileTokenSettings>(`http://localhost:8080/mobile/users/${id}`)
      .subscribe({
        next: (data) => this.settings = data,
        error: (err) => console.error('Failed to load token:', err)
      });
  }

  loadQRCode(id: number): void {
    this.http.get(`http://localhost:8080/mobile/users/${id}/qr`, {
      responseType: 'text',
    }).subscribe({
      next: (qrBase64) => {
        this.qrCode = qrBase64;
      },
      error: (err) => {
        console.error('Failed to load QR code:', err);
      }
    });
  }
  refreshToken() {
  if (!this.userData) return;
  this.loading = true;
  const id = this.userData.userId;

  this.http.post(`http://localhost:8080/mobile/users/${id}/refresh`, null)
    .subscribe({
      next: (updated) => {
        this.loadToken(id);    // refresh current token state
        this.loadQRCode(id);   // refresh QR image
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to refresh token:', err);
        this.loading = false;
      }
    });
}


}
