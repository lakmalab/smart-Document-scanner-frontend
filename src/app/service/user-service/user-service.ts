import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../../model/template.model';
import { ApiService } from '../api-service/api-service';

@Injectable({ providedIn: 'root' })
export class UserService {
 updateProfilePictureUrl(userId: number, url: string): Observable<User> {
    return this.api.post<User>(
      `auth/users/${userId}/profile-picture`,
      { url } ).pipe(
      map(user => {
        // Decode the URL when received from server
        if (user.profilePicturePath) {
          user.profilePicturePath = decodeURIComponent(user.profilePicturePath);
        }
        return user;
      })
    );
  }

  private api = inject(ApiService);

  updateUser(userId: number, updatedUser: Partial<User>): Observable<User> {
    return this.api.put<User>(`auth/users/${userId}`, updatedUser);
  }
  updatePassword(userId: number, updatedUser: Partial<User>): Observable<User> {
     return this.api.put<User>(`auth/userspass/${userId}`, updatedUser);
  }
  getUser(userId: number): Observable<User> {
    return this.api.get<User>(`auth/users/${userId}`);
  }

  getCurrentUserFromStorage(): User | null {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }
 
 
}
