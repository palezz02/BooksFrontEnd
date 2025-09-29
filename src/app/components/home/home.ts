import { Component } from '@angular/core';
import { BookService } from '../../services/book-service';
import { ResponseList } from '../../models/ResponseList';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  books: any = [];

  constructor(private bookService: BookService) { }

  ngOnInit(): void { 
    this.bookService.getBestByReviews(5, 0).subscribe((resp:ResponseList<any>) => {
      this.books = resp.dati;
      console.log(this.books);
    });
  }
}
