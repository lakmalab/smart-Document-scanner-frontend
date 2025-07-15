import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './pages/header/header';
import { Footer } from './pages/footer/footer';
import { Home } from './pages/home/home';
import { Login } from "./pages/login/login";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Login],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'test-angular';
}
