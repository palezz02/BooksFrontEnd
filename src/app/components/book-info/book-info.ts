import { Component } from '@angular/core';

export interface Book {
  title: string;
  author: string;
  category: string[];
  year: number;
  description: string;
  price: number;
  imageUrl?: string;
}

@Component({
  selector: 'app-book-info',
  standalone: false,
  templateUrl: './book-info.html',
  styleUrl: './book-info.css',
})
export class BookInfo {
  book: Book = {
    title: 'Le avventure di Kiwi',
    author: 'Kiwi',
    category: ['Avventura', 'Fantasy'],
    year: 2023,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    price: 19.99,
    imageUrl: 'https://covers.openlibrary.org/b/oclc/28419896-L.jpg',
  };

  quantity: number = 1;

  addToCart() {
    // Qui va la logica per aggiungere al carrello
    alert(`Aggiunto ${this.quantity} x ${this.book.title} al carrello!`);
  }

  buyNow() {
    // Qui va la logica per acquisto immediato
    alert(`Acquisto immediato: ${this.quantity} x ${this.book.title}`);
  }
}
