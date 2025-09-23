import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  searchQuery = '';
  menuOpen = false;

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
}
