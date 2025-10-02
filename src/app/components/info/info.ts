import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book-service';
import { of, switchMap, map, Observable } from 'rxjs';
import { ResponseObject } from '../../models/ResponseObject';

@Component({
  selector: 'app-info',
  standalone: false,
  templateUrl: './info.html',
  styleUrl: './info.css',
})
export class Info implements OnInit {
  book$!: Observable<any>;
  reviews$!: Observable<any[]>;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
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
          map((data: any) => {
            if (!data || !data.rc || !data.dati) return null;
            const d = data.dati;
            return {
              id: d.id,
              isbn: d.isbn,
              title: d.title,
              pageCount: d.pageCount,
              description: d.description,
              coverImage: d.coverImage,
              languageCode: d.languageCode,
              publicationDate: d.publicationDate,
              edition: d.edition,
              stock: d.stock,
              price: d.price,
              publisherName: d.publisherName,
              publisherDescription: d.publisherDescription,
              authors: d.authors?.map((a: any) => a.fullName),
              authorsFull: d.authors,
              cat: d.categories?.map((c: any) => c.name),
              reviews: d.reviews,
              averageRating: d.averageRating,
              inventoryId: d.inventoryId,
            };
          })
        );
      })
    );

    this.reviews$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const idString = params.get('bookId');
        return this.bookService
          .getBookReviews(Number(idString))
          .pipe(map((response: ResponseObject<any>) => response.dati || []));
      })
    );
  }
}
