import { Component } from '@angular/core';
import { BookService } from '../../services/book-service';
import { ResponseList } from '../../models/ResponseList';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  books$!: Observable<any[]>;

  constructor(private bookService: BookService) { }

  ngOnInit(): void { 
    this.books$ = this.bookService.getBestByReviews(5, 0).pipe(
      map((resp: ResponseList<any>) => resp.dati)
    );
  }
}
