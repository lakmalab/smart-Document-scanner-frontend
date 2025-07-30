import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user-service/user-service';
import { User } from '../../../model/template.model';

@Component({
  selector: 'app-edit-profile',
  imports: [FormsModule, HttpClientModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfileComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);

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

  ngOnInit(): void {
    this.userData = this.router.getCurrentNavigation()?.extras.state?.['user']
                 || JSON.parse(localStorage.getItem('user') || 'null');

    if (this.userData) {
      const nameParts = this.userData.name.split(' ');
      this.profile.firstName = nameParts[0] || '';
      this.profile.lastName = nameParts.slice(1).join(' ') || '';
      this.profile.email = this.userData.email;
      this.profile.address = this.userData.address || '';
      this.profile.contact = this.userData.contact || '';
      this.profile.city = this.userData.city || '';
      this.profile.province = this.userData.province || '';
      this.profile.password = this.userData.password || '';
    }
  }

  onSave(): void {
    if (!this.userData?.userId) {
      console.error('User ID missing');
      return;
    }

    const updatedUser: Partial<User> = {
      name: `${this.profile.firstName} ${this.profile.lastName}`,
      email: this.profile.email,
      password: this.profile.password
      // Add additional fields here if backend accepts them
    };

    this.userService.updateUser(this.userData.userId, updatedUser).subscribe({
      next: (updated) => {
        localStorage.setItem('user', JSON.stringify(updated));
        alert('Profile updated successfully!');
      },
      error: (err) => {
        console.error('Failed to update profile:', err);
        alert('Profile update failed.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/home']);
  }
}