import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
interface User {
  userId: number;
  name: string;
  email: string;
  address?: string;
  contact?: string;
  city?: string;
  province?: string;
  password?: string;
}

@Component({
  selector: 'app-edit-profile',
  imports: [FormsModule, HttpClientModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfile {
  userData: User | null = null;

  profile = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    contact: '',
    city: '',
    province: '',
    password: ''
  };

  constructor(private router: Router, private http: HttpClient) {
    this.userData = this.router.getCurrentNavigation()?.extras.state?.['user']
                 || JSON.parse(localStorage.getItem('user') || 'null');

    if (this.userData) {
      const nameParts = this.userData.name?.split(' ') || [];
      this.profile.firstName = nameParts[0] || '';
      this.profile.lastName = nameParts.slice(1).join(' ') || '';
      this.profile.email = this.userData.email || '';
      this.profile.address = this.userData.address || '';
      this.profile.contact = this.userData.contact || '';
      this.profile.city = this.userData.city || '';
      this.profile.province = this.userData.province || '';
      this.profile.password = this.userData.password || '';
    }
  }

  onSave() {
  if (!this.userData?.userId) {
    console.error("User ID is missing.");
    return;
  }

  const updatedUser = {
    name: this.profile.firstName + ' ' + this.profile.lastName,
    email: this.profile.email,
    password: this.profile.password
  };

  this.http.put(`http://localhost:8080/auth/users/${this.userData.userId}`, updatedUser)
    .subscribe({
      next: (response: any) => {
        console.log('User updated:', response);
        // Optional: Save updated info to localStorage
        localStorage.setItem('user', JSON.stringify(response));
        alert('Profile updated successfully!');
      },
      error: (error) => {
        console.error('Update failed:', error);
        alert('Failed to update profile.');
      }
    });
}



  onCancel() {
     this.router.navigate(['/home']);
  }
}
