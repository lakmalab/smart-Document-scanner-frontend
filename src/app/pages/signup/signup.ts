import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../service/auth-service/auth-service';
import { RegisterRequest } from '../../model/auth.model';
import { CustomToastService } from '../../service/toast/custom-toast.service';

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
  private toast: CustomToastService = inject(CustomToastService);

  onRegister(): void {
    const request: RegisterRequest = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.authService.register(request).subscribe({
      next: () => {
         this.toast.show( 'Registration successful!', 'happy', 'bi-star-fill');
    
        this.router.navigate(['/login']);
      },
      error: () => {
          this.toast.show('Registration failed. Try again', 'error', 'bi-star-fill');
      }
    });
  }
}