import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [RouterOutlet,RouterModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
   constructor(private router: Router, private http: HttpClient) {}
  api(){
     this.router.navigate(['/settings/api']); 
  }
}
