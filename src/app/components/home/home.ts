import { Component } from '@angular/core';
import { BookService } from '../../services/book-service';
import { ResponseList } from '../../models/ResponseList';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { BookDTO } from '../best-seller/best-seller';
import { AuthorServiceService } from '../../services/author-service.service';
import { PublisherService } from '../../services/publisher-service';
import { of } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  books$!: Observable<any[]>;
  bestCategoryBooks$!: Observable<any[]>;

  constructor(
    private bookService: BookService,
    private authorService: AuthorServiceService,
    private publisherService: PublisherService
  ) {}

  ngOnInit(): void {
    this.books$ = this.bookService
      .getBestByReviews(5, 0)
      .pipe(map((resp: ResponseList<any>) => resp.dati));
    this.loadBooks();
  }

  loadBooks() {
    this.bestCategoryBooks$ = this.bookService.getBestByCategory(50, 0).pipe(
      map((res: any) => res.dati),
      map((bookDTOs: BookDTO[]) => {
        const observables = bookDTOs.map((book) => {
          const authorRequests = book.authors.map((id) => this.authorService.getById(id));
          const publisherRequest = this.publisherService.getPublisher(book.publisher);

          return forkJoin([...authorRequests, publisherRequest]).pipe(
            map((results: any[]) => {
              const authors = results.slice(0, book.authors.length).map((a) => a.dati.fullName);
              const publisher = results[results.length - 1].dati.name;

              return { ...book, authors, publisher };
            })
          );
        });
        return forkJoin(observables);
      }),
      // flatten the nested Observable<Observable[]> to Observable[]
      // using switchMap
      switchMap((obs) => obs)
    );
  }
}
