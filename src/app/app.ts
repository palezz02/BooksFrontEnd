import { Component, signal } from '@angular/core';
import { AuthService } from './auth/authService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('BooksFrontEnd');

    constructor(public auth:AuthService, 
    private router:Router         
  ){}

  logout(){
    this.auth.resetAll();
    this.router.navigate(["/login"]);
  }
}
