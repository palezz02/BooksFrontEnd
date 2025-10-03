import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BookService } from '../../services/book-service';
import { AuthorServiceService } from '../../services/author-service.service';
import { PublisherService } from '../../services/publisher-service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface BookDTO {
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
  averageRating: number;
}


export interface Category {
  id: number;
  name: string;
}


@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.html',
  styleUrls: ['./best-seller.css'],
  standalone: false
})
export class BestSeller implements OnChanges {
  @Input() books: any[] = []; 

  currentIndex = 0;


  ngOnChanges(changes: SimpleChanges) {
    if (changes['books'] && this.books && this.books.length > 0) {
      this.currentIndex = 0;
    }
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

  get currentBookAuthors(): string {
    return this.currentBook?.authors?.join(', ') || '';
  }

  get currentBookCategories(): string {
    return this.currentBook?.categories?.map((c: Category) => c.name).join(', ') || '';
  }

}
