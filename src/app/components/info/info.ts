import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book-service';
import { AuthorServiceService } from '../../services/author-service.service';
import { PublisherService } from '../../services/publisher-service';
import { forkJoin, switchMap, of, map, Observable } from 'rxjs';
import { ResponseObject } from '../../models/ResponseObject';
import { Book, CompleteBook } from '../book-info/book-info';

@Component({
  selector: 'app-info',
  standalone: false,
  templateUrl: './info.html',
  styleUrl: './info.css',
})
export class Info implements OnInit {
  book$!: Observable<CompleteBook | null>;
  reviews$!: Observable<any[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private authorService: AuthorServiceService,
    private publisherService: PublisherService
  ) {}

  ngOnInit(): void {
    this.book$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const idString = params.get('bookId');
        const bookId = idString ? Number(idString) : null;
        if (!bookId) {
          this.router.navigate(['/error']);
          return of(null);
        }
        return this.bookService.getById(bookId).pipe(
          switchMap((response: ResponseObject<Book>) => {
            const partialBook = response.dati;
            const publisher$ = this.publisherService.getPublisher(partialBook.publisher);
            const authors$ = partialBook.authors.map((authorId) =>
              this.authorService.getById(authorId)
            );
            return forkJoin([publisher$, ...authors$]).pipe(
              map(([publisher, ...authors]: any[]) => {
                const completeBook: CompleteBook = {
                  ...partialBook,
                  publisher: publisher.dati,
                  authors: authors.map((a: any) => a.dati),
                  publisherId: partialBook.inventoryId,
                };
                return completeBook;
              })
            );
          })
        );
      })
    );

    this.reviews$ = this.book$.pipe(
      switchMap((book) => {
        return this.bookService
          .getBookReviews(book!.id)
          .pipe(map((response: ResponseObject<any>) => response.dati || []));
      })
    );
  }
}
