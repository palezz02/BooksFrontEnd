import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogged = false;
  isAdmin = false;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // piattaforId é utilizzato per sapere il tipo di piattaform dove gira l'app
    console.log("AuthService constructor");

    // controllo se l'app é un browser
    if (isPlatformBrowser(this.platformId)) {
      const isLoggedValue = localStorage.getItem("isLogged");
      const isAdminValue = localStorage.getItem("isAdmin");

      if (isLoggedValue != null && isAdminValue != null) {
        console.log('token exist');
        this.isLogged = isLoggedValue === '1';
        this.isAdmin = isAdminValue === '1';
      } else {
        localStorage.setItem("isLogged", "0");
        localStorage.setItem("isAdmin", "0");
      }

      console.log("isLogged:", this.isLogged)
      console.log("isAdmin:", this.isAdmin)
    }
  }


  isAutentificated() {

    return this.isLogged;
  }

  isRoleAdmin() {
    return this.isAdmin;
  }
  setAuthentificated() {
    localStorage.setItem("isLogged", "1");
    localStorage.setItem("isAdmin", "0");
    this.isLogged = true;
    this.isAdmin = false;
  }
  setAdmin() {
    localStorage.setItem("isAdmin", "1");
    this.isAdmin = true;
  }
  resetAll() {
    localStorage.setItem("isLogged", "0");
    localStorage.setItem("isAdmin", "0");
    this.isLogged = false;
    this.isAdmin = false;

  }
}
