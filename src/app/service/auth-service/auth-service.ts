import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '../../model/auth.model';
import { ApiService } from '../api-service/api-service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.api.post<LoginResponse>(`auth/login`, credentials);
  }

  saveAuthData(token: string, user: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.clear();
  }

  register(request: RegisterRequest) {
    return this.api.post(`auth/register`, request);
  }
}
