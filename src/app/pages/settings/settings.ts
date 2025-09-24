import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from '../../service/user-service/user-service';
import { User } from '../../model/template.model';
import { AvatarModule } from 'primeng/avatar';
import { Button } from "primeng/button";
import { PanelMenuModule } from 'primeng/panelmenu';
import { Chip } from "primeng/chip";

@Component({
  selector: 'app-settings',
  imports: [RouterOutlet, RouterModule, AvatarModule, Button, PanelMenuModule, Chip],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
logout() {
 this.router.navigate(['/login']);
}
  userData: User | null = null;
  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {
    this.userData =
      this.router.getCurrentNavigation()?.extras.state?.['user'] ||
      JSON.parse(localStorage.getItem('user') || 'null');
  }

  api() {
    this.router.navigate(['/settings/api']);
  }
  handleImageError($event: Event) {
    throw new Error('Method not implemented.');
  }
}
