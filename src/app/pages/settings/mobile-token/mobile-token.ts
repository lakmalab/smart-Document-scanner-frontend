import { NgClass, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { User } from '../../../model/template.model';
import { MobileTokenSettings } from '../../../model/mobile-token-settings.model';
import { MobileTokenService } from '../../../service/mobile-token-service/mobile-token-service';

@Component({
  selector: 'app-mobile-token',
  imports: [NgIf,FormsModule,HttpClientModule,DatePipe,NgClass],
  templateUrl:'./mobile-token.html',
  styleUrl: './mobile-token.css'
})

export class MobileTokenComponent implements OnInit {
  private router = inject(Router);
  private tokenService = inject(MobileTokenService);

  userData: User | null = null;
  settings: MobileTokenSettings = { used: false, token: '', expiresAt: null };
  qrCode: string | null = null;
  loading = false;
  minDate = new Date();

  ngOnInit(): void {
    this.userData = this.router.getCurrentNavigation()?.extras.state?.['user']
      || JSON.parse(localStorage.getItem('user') || 'null');

    if (!this.userData) return;

    const userId = this.userData.userId;
    this.loadToken(userId);
    this.loadQRCode(userId);

    // Poll every 5 seconds
    setInterval(() => this.loadToken(userId), 5000);
  }

  loadToken(userId: number): void {
    this.tokenService.getToken(userId).subscribe({
      next: (data) => this.settings = data,
      error: (err) => console.error('Failed to load token:', err)
    });
  }

  loadQRCode(userId: number): void {
    this.tokenService.getQrCode(userId).subscribe({
      next: (qrBase64) => this.qrCode = qrBase64,
      error: (err) => console.error('Failed to load QR code:', err)
    });
  }

  refreshToken(): void {
    if (!this.userData) return;

    this.loading = true;
    const id = this.userData.userId;

    this.tokenService.refreshToken(id).subscribe({
      next: () => {
        this.loadToken(id);
        this.loadQRCode(id);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to refresh token:', err);
        this.loading = false;
      }
    });
  }
}