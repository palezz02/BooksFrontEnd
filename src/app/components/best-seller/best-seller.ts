import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book-service';
import { AuthorServiceService } from '../../services/author-service.service';
import { PublisherService } from '../../services/publisher-service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface BookDTO {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  publicationDate: string;
  languageCode: string;
  edition: string;
  publisher: number;         
  authors: number[];       
  categories: { id: number; name: string }[];
  reviews: number[];
}

interface Author {
  id: number;
  fullName: string;
}

interface Publisher {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}


@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.html',
  styleUrls: ['./best-seller.css'],
  standalone: false
})
export class BestSeller implements OnInit {
  books: any[] = []; 

  currentIndex = 0;

  constructor(
    private bookService: BookService,
    private authorService: AuthorServiceService,
    private publisherService: PublisherService
  ) {}

  ngOnInit() {
    this.loadBooks();
  }

  get currentBook() {
    return this.books[this.currentIndex];
  }

  prevBook() {
    this.currentIndex = (this.currentIndex - 1 + this.books.length) % this.books.length;
  }

  nextBook() {
    this.currentIndex = (this.currentIndex + 1) % this.books.length;
  }

  //get currentBookCategories(): string {
  //  return this.currentBook?.categories?.map(c => c.name).join(', ') || '';
  //}

  get currentBookAuthors(): string {
    return this.currentBook?.authors?.join(', ') || '';
  }

  get currentBookCategories(): string {
  return this.currentBook?.categories?.map((c: Category) => c.name).join(', ') || '';
}


  loadBooks() {
    this.bookService.getAll().subscribe((res: any) => {
      const bookDTOs: BookDTO[] = res.dati;

      
      const observables: Observable<any>[] = bookDTOs.map(book => {
        const authorRequests: Observable<any>[] = book.authors.map(id => this.authorService.getById(id));
        const publisherRequest: Observable<any> = this.publisherService.getPublisher(book.publisher);

        
        return forkJoin([...authorRequests, publisherRequest]).pipe(
          map((results: any[]) => {
            const authors = results.slice(0, book.authors.length).map(a => a.dati.fullName);
            const publisher = results[results.length - 1].dati.name;

            return {
              ...book,
              authors,
              publisher
            };
          })
        );
      });

     
      forkJoin(observables).subscribe((booksWithNames: any[]) => {
        this.books = booksWithNames;
      });
    });
  }
}
