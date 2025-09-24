import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user-service/user-service';
import { AuthService } from '../../service/auth-service/auth-service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../model/template.model';
import { NgIf } from '@angular/common';
import { Button } from "primeng/button";
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-header',
  imports: [NgIf, NgbDropdownModule, ChipModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
 
export class Header implements OnInit {
  
   userData: User | null = null;
  ngOnInit(): void {
   this.userData = this.router.getCurrentNavigation()?.extras.state?.['user']
                 || JSON.parse(localStorage.getItem('user') || 'null');
  }
  
    private authService = inject(AuthService);
  
handleImageError($event: ErrorEvent) {
throw new Error('Method not implemented.');
}


  constructor(private http: HttpClient, private router: Router) {}
  isLoginPage(): boolean {
  return this.router.url === '/login' || this.router.url === '/signup';
}
 get currentUrl(): string {
    return this.router.url;
  }
  goToAuthPage() {
    if (this.isLoginPage()) {
      this.router.navigate(['/signup']);
    } else {
      this.router.navigate(['/settings']);
    }
  }
   goToProfile() {
    this.router.navigate(['settings']);
  }

  goToSettings() {
    this.router.navigate(['/settings/api']);
  }

  signOut() {
    // Add your sign out logic here
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
