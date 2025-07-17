import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, NgIf],
  templateUrl: './login.html',
  styleUrls: ['./login.css'] 
})
export class Login {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  goToSignup() {
  this.router.navigate(['/signup']);
  }
  onLogin() {
    const credentials = {
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:8080/auth/login', credentials).subscribe({
      next: (response) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.router.navigate(['/home'], {
          state: { user: response }  
        });
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}