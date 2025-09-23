import { Component } from '@angular/core';

export interface Book {
  title: string;
  author: string;
  publisher: string,
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
    publisher: 'kiwipublishing',
    category: ['Avventura', 'Fantasy'],
    year: 2023,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    price: 19.99,
    imageUrl: 'https://covers.openlibrary.org/b/oclc/28419896-L.jpg',
  };

  showPublisherPopup: boolean = false;

  publisherData: { name: string; description: string } | null = null;

  openPublisherPopup() {
  this.publisherData = {
    name: this.book.publisher,
    description: `kiwiPublishing has been bringing imaginative worlds to readers for over 20 years. 
    From epic fantasy to thought-provoking science fiction, our books transport you into adventures you'll never forget. 
    Join us on a journey through magical lands, futuristic galaxies, and thrilling mysteries, all crafted by top authors 
    passionate about storytelling.`
  };
  this.showPublisherPopup = true;
  }

  closePublisherPopup() {
    this.showPublisherPopup = false;
  }

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
