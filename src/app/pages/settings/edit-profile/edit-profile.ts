import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user-service/user-service';
import { User } from '../../../model/template.model';
import { NgIf } from '@angular/common';
import { ModalService } from '../../../service/modal/modal-service';
import { CustomToastService } from '../../../service/toast/custom-toast.service';

@Component({
  selector: 'app-edit-profile',
  imports: [NgIf, FormsModule, HttpClientModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfileComponent implements OnInit {
  constructor(private toast: CustomToastService) {}
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
    this.modalService.show(
      'Confirm Save',
      'Are you sure you want to save changes?',
      () => {
        if (!this.userData?.userId) {
          console.error('User ID missing');
          return;
        }

        const updatedUser: Partial<User> = {
          name: `${this.profile.firstName} ${this.profile.lastName}`,
          email: this.profile.email,
          password: this.profile.password,
        };

        this.userService
          .updatePassword(this.userData.userId, updatedUser)
          .subscribe({
            next: (updated) => {
              localStorage.setItem('user', JSON.stringify(updated));
              this.toast.show('Profile updated successfully!', 'success');
            },
            error: (err) => {
              console.error('Failed to update profile:', err);
              this.toast.show('Profile update failed', 'error');
            },
          });
      }
    );
  }
  private router = inject(Router);
  private userService = inject(UserService);
  private modalService: ModalService = inject(ModalService);
  userData: User | null = null;

  profile = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    contact: '',
    city: '',
    province: '',
    password: '',
  };

  ngOnInit(): void {
    this.userData =
      this.router.getCurrentNavigation()?.extras.state?.['user'] ||
      JSON.parse(localStorage.getItem('user') || 'null');

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
  save() {
    this.modalService.show(
      'Confirm Save',
      'Are you sure you want to save changes?',
      () => this.onSave()
    );
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
      province: this.profile.province,
    };

    this.userService.updateUser(this.userData.userId, updatedUser).subscribe({
      next: (updated) => {
        localStorage.setItem('user', JSON.stringify(updated));
        this.toast.show('Profile updated successfully!', 'success');
      },
      error: (err) => {
        console.error('Failed to update profile:', err);
        this.toast.show('Profile update failed', 'error');
      },
    });
  }
  profilePictureUrl: string = '';

  updateProfilePicture(): void {
    this.errorMessage = '';

    if (!this.profilePictureUrl?.trim()) {
      this.toast.show('Please enter a valid UR', 'error');
      this.errorMessage = 'Please enter a valid URL';
      return;
    }

    if (!this.userData?.userId) {
      this.toast.show('User not identified', 'error');
      this.errorMessage = 'User not identified';
      return;
    }

    try {
      new URL(this.profilePictureUrl);
    } catch (e) {
      this.toast.show('Invalid URL', 'error');
      this.errorMessage =
        'Please enter a valid URL (include http:// or https://)';
      return;
    }

    this.userService
      .updateProfilePictureUrl(this.userData.userId, this.profilePictureUrl)
      .subscribe({
        next: (updatedUser) => {
          this.userData = updatedUser;
          localStorage.setItem('user', JSON.stringify(updatedUser));
        },
        error: (err) => {
          this.errorMessage = 'Failed to update profile picture';
          this.toast.show('Update', 'error');
          console.error('Update failed:', err);
        },
      });
  }
  onCancel(): void {
    this.router.navigate(['/home']);
  }
}
