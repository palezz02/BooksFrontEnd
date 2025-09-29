import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'app-best-book-carosel',
  standalone: false,
  templateUrl: './best-book-carosel.html',
  styleUrls: ['./best-book-carosel.css'],
})
export class BestBookCarosel implements OnInit, OnChanges {
  
  cols$: Observable<number>;
  currentCols: number = 0;
  
  @Input() books: any[] = [];
  visibleBooks: any[] = [];

  private startIndex = 0;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.cols$ = this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).pipe(
      map(result => {
        if (result.breakpoints[Breakpoints.XSmall]) {
          return 1;
        } else if (result.breakpoints[Breakpoints.Small]) {
          return 2;
        } else if (result.breakpoints[Breakpoints.Medium]) {
          return 3;
        } else if (result.breakpoints[Breakpoints.Large]) {
          return 4;
        } else if (result.breakpoints[Breakpoints.XLarge]) {
          return 5;
        }
        return 0;
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  ngOnInit() {
    this.cols$.subscribe(cols => {
      this.currentCols = cols;
      this.updateVisibleBooks(this.currentCols);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['books'] && this.books && this.books.length > 0) {
      this.updateVisibleBooks(this.currentCols);
    }
  }

  scroll(direction: string) {
    if (this.books.length === 0) {
      return;
    }

    if (direction === 'right') {
      this.startIndex = (this.startIndex + 1) % this.books.length;
    } else if (direction === 'left') {
      this.startIndex = (this.startIndex - 1 + this.books.length) % this.books.length;
    }
    this.updateVisibleBooks(this.currentCols);
  }

  private updateVisibleBooks(cols: number) {
    const endIndex = this.startIndex + cols;
    if (endIndex <= this.books.length) {
      this.visibleBooks = this.books.slice(this.startIndex, endIndex);
    } else {
      const part1 = this.books.slice(this.startIndex, this.books.length);
      const part2 = this.books.slice(0, endIndex - this.books.length);
      this.visibleBooks = [...part1, ...part2];
    }
  }
}