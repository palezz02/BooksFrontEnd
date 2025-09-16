import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  searchQuery = '';

  onSearch() {
    console.log('Ricerca:', this.searchQuery);
    // Qui puoi gestire la logica della ricerca
  }
}
