import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../service/auth-service/auth-service';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, NgIf,ButtonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  loading: boolean = false;
  checked:  boolean = false;

  onLogin(): void {
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter both email and password';
      return; 
    }
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.authService.saveAuthData(res.token, res.user);
        this.router.navigate(['/home'], { state: { user: res.user } });
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
      },
    });
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}