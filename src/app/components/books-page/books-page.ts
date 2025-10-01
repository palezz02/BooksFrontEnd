import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BookService } from '../../services/book-service';
import { AuthorServiceService } from '../../services/author-service.service';
import { PublisherService } from '../../services/publisher-service';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';


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
  authors: number[];
  publisher: number;
  categories: { id: number; name: string }[];
}


@Component({
  selector: 'app-books-page',
  templateUrl: './books-page.html',
  styleUrls: ['./books-page.css'],
  standalone: false,
})
export class BooksPage implements OnInit {

  constructor(
    private bookService: BookService,
    private authorService: AuthorServiceService,
    private publisherService: PublisherService
  ) {}


  books: any[] = [];
  filteredBooks: any[] = [];
  pagedBooks: any[] = [];


  searchTerm: string = '';
  selectedCategory: string = '';
  selectedLanguage: string = '';

  categories: string[] = [];
  languages: string[] = [];



  pageSize = 10;
  currentPage = 0;

  books$!: Observable<any[]>;

  ngOnInit() {
    this.books$ = this.bookService.getAll().pipe(
      switchMap((res: any) => {
        const bookDTOs: BookDTO[] = res.dati;

        const observables = bookDTOs.map(book => {
          const authorRequests = book.authors.map(id =>
            this.authorService.getById(id)
          );
          const publisherRequest = this.publisherService.getPublisher(book.publisher);

          return forkJoin([...authorRequests, publisherRequest]).pipe(
            map((results: any[]) => {
              const authors = results.slice(0, book.authors.length).map(a => ({
                id: a.dati.id,
                fullName: a.dati.fullName,
              }));
              const publisher = {
                id: results[results.length - 1].dati.id,
                name: results[results.length - 1].dati.name,
              };
              return { ...book, authors, publisher };
            })
          );
        });

        return forkJoin(observables);
      }),
      tap(books => {
        this.books = books;
        this.filteredBooks = books;
        this.categories = Array.from(new Set(books.flatMap(b => b.categories.map((c: any) => c.name))));
        this.languages = Array.from(new Set(books.map(b => b.languageCode.toUpperCase())));
        this.updatePagedBooks();
      })
    );
  }





  getAuthorNames(book: any): string {
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
        book.categories.some((c: { id: number; name: string }) =>
          c.name === this.selectedCategory
        );

        
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
