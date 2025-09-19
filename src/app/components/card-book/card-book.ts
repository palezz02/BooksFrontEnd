import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-book',
  standalone: false,
  templateUrl: './card-book.html',
  styleUrl: './card-book.css'
})
export class CardBook {
  @Input() book: any;
}
