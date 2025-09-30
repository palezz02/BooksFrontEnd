import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';


export type Author = {
  id: number;
  fullName: string;
  biography: string;
  birthDate: Date;
  deathDate: Date;
  coverImage?: string;
};

export type Publisher = {
  id: number;
  name: string;
  description: string;
};

export type CategoryDTO = {
  id: number;
  name: string;
};

export type Book = {
  id: number;
  isbn: string;
  title: string;
  pageCount: number;
  description: string;
  coverImage: string;
  languageCode: string;
  publicationDate: string;
  edition: string;
  stock: number;
  price: number;
  publisher: number;
  authors: number[];
  categories: CategoryDTO[];
  averageRating: number;
};

export type CompleteBook = Omit<Book, 'publisher' | 'authors'> & {
  publisher: Publisher;
  authors: Author[];
};

@Component({
  selector: 'app-book-info',
  standalone: false,
  templateUrl: './book-info.html',
  styleUrl: './book-info.css',
})
export class BookInfo {
  @Input() book: CompleteBook | null = null;

  showPublisherPopup: boolean = false;
  publisherData: Publisher | null = null;

  showAuthorPopup: boolean = false;
  authorData: Author | null = null;

  quantity: number = 1;

  constructor(private router: Router) {}

  openPublisherPopup() {
    if (!this.book) return;
    this.publisherData = this.book.publisher;
    this.showPublisherPopup = true;
  }

  closePublisherPopup() {
    this.showPublisherPopup = false;
  }

  openAuthorPopup(authorId: number) {
    if (!this.book) return;
    const selectedAuthor = this.book.authors.find(a => a.id === authorId);
    if (selectedAuthor) {
      this.authorData = selectedAuthor;
      this.showAuthorPopup = true;
    } else {
      console.warn(`Autore con ID ${authorId} non trovato.`);
    }
  }

  closeAuthorPopup() {
    this.showAuthorPopup = false;
  }

  addToCart() {
    if (!this.book) return;
    console.log(`Aggiunto ${this.quantity} x ${this.book.title} al carrello!`);
    
  }

  buyNow() {
    if (!this.book) return;
    console.log(`Acquisto immediato: ${this.quantity} x ${this.book.title}`);
    this.router.navigate(['/cart']);
  }
}