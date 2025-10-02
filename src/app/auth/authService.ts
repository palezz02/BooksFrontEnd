import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
// import { ConfigService } from '../services/config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLogged = false;
  isAdmin = false;
  userId: number | null = null;
  constUserId: number | null = null;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // piattaforId é utilizzato per sapere il tipo di piattaform dove gira l'app
    console.log('AuthService constructor');

    // controllo se l'app é un browser
    if (isPlatformBrowser(this.platformId)) {
      this.isLogged = localStorage.getItem('token') ? true : false;
      this.isAdmin = this.isRoleAdmin();
    }

    // this.buildURL();
  }
  setUserIdOnLogin(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('userId', id);
      this.userId = Number(id);
      this.constUserId = Number(id);
    }
  }
  // public buildURL() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     this.conf.getConfig().subscribe((r: any) => {
  //       localStorage.setItem('configurationURL', r.urlConfig);
  //       //       console.log("ulr trovata:" + r.urlConfig);
  //     });
  //   }
  // }

  getUserId() {
    const token = isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null;
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Cerca il ruolo ADMIN (supporta sia array che stringa)
      if (payload && payload.userId) {
        return payload.userId;
      }
    } catch {
      return null;
    }
    return null;
  }

  isAuthenticated() {
    const token = isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null;
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Cerca il ruolo ADMIN (supporta sia array che stringa)
      if (payload && payload.roles) {
        if (Array.isArray(payload.roles)) {
          return payload.roles[0].includes('CUSTOMER') || payload.roles[0].includes('ADMIN');
        }
        return payload.roles[0] === 'ADMIN' || payload.roles[0] === 'CUSTOMER';
      }
    } catch {
      return false;
    }
    return false;
  }

  isRoleAdmin() {
    // Cerca il token JWT in localStorage
    const token = isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null;
    if (!token) return false;

    // Decodifica il payload del JWT
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Cerca il ruolo ADMIN (supporta sia array che stringa)
      if (payload && payload.roles) {
        if (Array.isArray(payload.roles)) {
          return payload.roles[0].includes('ADMIN');
        }
        return payload.roles[0] === 'ADMIN';
      }
    } catch {
      return false;
    }
    return false;
  }

  resetAll() {
    localStorage.clear();
    this.isLogged = false;
    this.isAdmin = false;
  }
}
