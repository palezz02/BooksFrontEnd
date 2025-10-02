import { Component } from '@angular/core';
import { BookService } from '../../services/book-service';
import { ResponseList } from '../../models/ResponseList';
import { map, Observable } from 'rxjs';
import { BookDTO } from '../best-seller/best-seller';
import { AuthorServiceService } from '../../services/author-service.service';
import { PublisherService } from '../../services/publisher-service';

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
    this.bestCategoryBooks$ = this.bookService.getBestByCategory(5, 0).pipe(
      map((res: any) => res.dati),
      map((books: any[]) => {
        console.log(books);
        return books.map((dati) => ({
          id: dati.id,
          title: dati.title,
          description: dati.description,
          coverImage: dati.coverImage,
          languageCode: dati.languageCode,
          publicationDate: dati.publicationDate,
          edition: dati.edition,
          publisher: dati.publisherName,
          authors: dati.authors?.map((a: any) => a.fullName),
          categories: dati.categories,
          reviews: dati.reviews,
          averageRating: dati.averageRating,
        }));
      })
    );
  }
}
