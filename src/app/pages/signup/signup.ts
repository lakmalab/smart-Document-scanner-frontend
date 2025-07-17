import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [FormsModule,HttpClientModule,NgIf],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class SignUp {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    const body = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.http.post<any>('http://localhost:8080/auth/register', body).subscribe({
      next: () => {
        this.successMessage = 'Registration successful!';
        this.router.navigate(['/login']); // redirect to login
      },
      error: () => {
        this.errorMessage = 'Registration failed. Try again.';
      }
    });
  }
}
