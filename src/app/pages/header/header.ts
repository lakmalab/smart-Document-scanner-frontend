import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
 
export class Header {
   constructor(private http: HttpClient, private router: Router) {}
 goToSettings() {
  this.router.navigate(['/settings']);
  }
}
