import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../auth/authService';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  searchQuery = '';
  menuOpen = false;
  admin = false;
  loggedIn = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private router: Router
  ) {}

  updateAdminStatus() {
    if (isPlatformBrowser(this.platformId)) {
      this.loggedIn = this.authService.isAuthenticated();
      this.admin = this.authService.isRoleAdmin();
    }
  }
  onLoggedInClick() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      cookieStore.delete('token');
      this.authService.isAuthenticated();
      this.router.navigate(['login']);
    }
  }
  ngOnInit() {
    this.updateAdminStatus();
  }

  onSearch() {
    console.log('Ricerca:', this.searchQuery);
    // Qui puoi gestire la logica della ricerca
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenuIfMobile() {
    if (window.innerWidth <= 600) {
      this.menuOpen = false;
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 600 && this.menuOpen) {
      this.menuOpen = false;
    }
  }

  scrollToFooter() {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
