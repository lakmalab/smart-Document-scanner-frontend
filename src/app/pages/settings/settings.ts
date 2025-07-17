import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [RouterOutlet],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
   constructor(private router: Router, private http: HttpClient) {}
  api(){
     this.router.navigate(['/api']);
  }
}
