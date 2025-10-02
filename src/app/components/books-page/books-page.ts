import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BookService } from '../../services/book-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface BookDTO {
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
  publisherId: number;
  publisherName: string;
  publisherDescription: string;
  authors: {
    id: number;
    fullName: string;
    biography: string;
    birthDate: string;
    deathDate: string;
    coverImageUrl: string;
    books: number[];
  }[];
  categories: { id: number; name: string }[];
  reviews: number[];
  averageRating: number;
  inventoryId: number;
}

@Component({
  selector: 'app-books-page',
  templateUrl: './books-page.html',
  styleUrls: ['./books-page.css'],
  standalone: false,
})
export class BooksPage implements OnInit {
  constructor(private bookService: BookService) {}

  books: BookDTO[] = [];
  filteredBooks: BookDTO[] = [];
  pagedBooks: BookDTO[] = [];

  searchTerm: string = '';
  selectedCategory: string = '';
  selectedLanguage: string = '';

  categories: string[] = [];
  languages: string[] = [];

  pageSize = 10;
  currentPage = 0;

  books$!: Observable<BookDTO[]>;

  ngOnInit() {
    this.books$ = this.bookService.getAll().pipe(
      map((res: any) => {
        const bookDTOs: BookDTO[] = res.dati;
        this.books = bookDTOs;
        this.filteredBooks = bookDTOs;
        this.categories = Array.from(
          new Set(bookDTOs.flatMap((b) => b.categories.map((c: any) => c.name)))
        );
        this.languages = Array.from(new Set(bookDTOs.map((b) => b.languageCode.toUpperCase())));
        this.updatePagedBooks();
        return bookDTOs;
      })
    );
  }

  getAuthorNames(book: BookDTO): string {
    return book.authors.map((a: any) => a.fullName).join(', ');
  }

  filterBooks() {
    this.filteredBooks = this.books.filter((book) => {
      const matchesSearch =
        this.searchTerm === '' ||
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        book.authors.some((a: { id: number; fullName: string }) =>
          a.fullName.toLowerCase().includes(this.searchTerm.toLowerCase())
        );

      const matchesCategory =
        this.selectedCategory === '' ||
        book.categories.some((c: { id: number; name: string }) => c.name === this.selectedCategory);

      const matchesLanguage =
        this.selectedLanguage === '' ||
        book.languageCode.toLowerCase() === this.selectedLanguage.toLowerCase();

      return matchesSearch && matchesCategory && matchesLanguage;
    });

    this.currentPage = 0;
    this.updatePagedBooks();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedBooks();
  }

  private updatePagedBooks() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pagedBooks = this.filteredBooks.slice(start, end);
  }
}
