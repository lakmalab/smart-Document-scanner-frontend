import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../model/template.model';
import { ApiService } from '../api-service/api-service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(ApiService);

  updateUser(userId: number, updatedUser: Partial<User>): Observable<User> {
    return this.api.put<User>(`auth/users/${userId}`, updatedUser);
  }

  getUser(userId: number): Observable<User> {
    return this.api.get<User>(`auth/users/${userId}`);
  }

  getCurrentUserFromStorage(): User | null {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }
}
