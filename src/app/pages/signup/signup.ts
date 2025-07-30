import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../service/auth-service/auth-service';
import { RegisterRequest } from '../../model/auth.model';

@Component({
  selector: 'app-signup',
  imports: [FormsModule,HttpClientModule,NgIf],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  onRegister(): void {
    const request: RegisterRequest = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.authService.register(request).subscribe({
      next: () => {
        this.successMessage = 'Registration successful!';
        this.router.navigate(['/login']);
      },
      error: () => {
        this.errorMessage = 'Registration failed. Try again.';
      }
    });
  }
}