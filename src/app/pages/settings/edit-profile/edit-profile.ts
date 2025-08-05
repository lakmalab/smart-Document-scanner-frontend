import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user-service/user-service';
import { User } from '../../../model/template.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  imports: [NgIf,FormsModule, HttpClientModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfileComponent implements OnInit {
  showUrlInput: boolean = false;
errorMessage: string = '';
handleImageError($event: ErrorEvent) {
throw new Error('Method not implemented.');
}
 toggleUrlInput() {
    this.showUrlInput = !this.showUrlInput;
    console.log('Input visibility toggled to:', this.showUrlInput); // Debug
  }
onPasswordChange() {
     if (!this.userData?.userId) {
      console.error('User ID missing');
      return;
    }

    const updatedUser: Partial<User> = {
      name: `${this.profile.firstName} ${this.profile.lastName}`,
      email: this.profile.email,
      password: this.profile.password,
    };

    this.userService.updatePassword(this.userData.userId, updatedUser).subscribe({
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
      this.profile.contact = this.userData.contactNumber || '';
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
      address: this.profile.address,
      contactNumber: this.profile.contact,
      city: this.profile.city,
      province: this.profile.province
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
profilePictureUrl: string = '';

// Add this method
updateProfilePicture(): void {
  this.errorMessage = '';
  
  if (!this.profilePictureUrl?.trim()) {
    this.errorMessage = 'Please enter a valid URL';
    return;
  }

  if (!this.userData?.userId) {
    this.errorMessage = 'User not identified';
    return;
  }

  // Validate URL format
  try {
    new URL(this.profilePictureUrl);
  } catch (e) {
    this.errorMessage = 'Please enter a valid URL (include http:// or https://)';
    return;
  }

  this.userService.updateProfilePictureUrl(this.userData.userId, this.profilePictureUrl)
    .subscribe({
      next: (updatedUser) => {
        this.userData = updatedUser;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      },
      error: (err) => {
        this.errorMessage = 'Failed to update profile picture';
        console.error('Update failed:', err);
      }
    });
}
  onCancel(): void {
    this.router.navigate(['/home']);
  }
}