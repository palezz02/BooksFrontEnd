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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private authorService: AuthorServiceService,
    private publisherService: PublisherService
  ) {}

  ngOnInit(): void {
    this.book$ = this.route.paramMap.pipe(
      switchMap(params => {
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
            const authors$ = partialBook.authors.map(authorId => this.authorService.getById(authorId));
            return forkJoin([publisher$, ...authors$]).pipe(
              map(([publisher, ...authors]: any[]) => {
                const completeBook: CompleteBook = {
                  ...partialBook,
                  publisher: publisher.dati,
                  authors: authors.map((a: any) => a.dati),
                };
                return completeBook;
              })
            );
          })
        );
      })
    );
  }

  reviews: any[] = [
    {
      id: 1,
      bookId: 1,
      reviewer: 'Mario Rossi',
      text: 'Un libro fantastico!',
      rating: 5,
    },
    {
      id: 2,
      bookId: 1,
      reviewer: 'Luigi Verdi',
      text: 'Molto interessante e avvincente.',
      rating: 4,
    },
    {
      id: 3,
      bookId: 1,
      reviewer: 'Giulia Bianchi',
      text: 'Mi ha emozionato tantissimo, consigliato!',
      rating: 5,
    },
    {
      id: 4,
      bookId: 1,
      reviewer: 'Marco Neri',
      text: 'Alcuni capitoli sono un po’ lenti, ma nel complesso buono.',
      rating: 3,
    },
    {
      id: 5,
      bookId: 1,
      reviewer: 'Sara Blu',
      text: 'Personaggi ben scritti e storia coinvolgente.',
      rating: 4,
    },
    {
      id: 6,
      bookId: 1,
      reviewer: 'Luca Gialli',
      text: 'Non sono riuscito a finirlo, troppo lento.',
      rating: 2,
    },
    {
      id: 7,
      bookId: 1,
      reviewer: 'Marta Viola',
      text: 'Uno dei migliori libri letti quest’anno!',
      rating: 5,
    },
  ];
}
