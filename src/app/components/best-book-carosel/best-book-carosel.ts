import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './best-book-carosel.html',
  styleUrl: './best-book-carosel.css',
})
export class BestBookCarosel {
  cols$: Observable<number> | undefined;
  books = [
    {
      id: 1,
      title: 'Libro 1',
      url: 'https://cdn-imgix.headout.com/tour/19364/TOUR-IMAGE/a0f87f7e-434d-4c3c-9584-f7ee351d5f64-10432-dubai-img-worlds-of-adventure---uae-resident-offer-01.jpg?auto=format&w=510.8727272727273&h=401.4&q=90&ar=14%3A11&crop=faces&fit=crop',
    },
    {
      id: 2,
      title: 'Libro 2',
      url: 'https://cdn-imgix.headout.com/tour/19364/TOUR-IMAGE/a0f87f7e-434d-4c3c-9584-f7ee351d5f64-10432-dubai-img-worlds-of-adventure---uae-resident-offer-01.jpg?auto=format&w=510.8727272727273&h=401.4&q=90&ar=14%3A11&crop=faces&fit=crop',
    },
    {
      id: 3,
      title: 'Libro 3',
      url: 'https://cdn-imgix.headout.com/tour/19364/TOUR-IMAGE/a0f87f7e-434d-4c3c-9584-f7ee351d5f64-10432-dubai-img-worlds-of-adventure---uae-resident-offer-01.jpg?auto=format&w=510.8727272727273&h=401.4&q=90&ar=14%3A11&crop=faces&fit=crop',
    },
    {
      id: 4,
      title: 'Libro 4',
      url: 'https://cdn-imgix.headout.com/tour/19364/TOUR-IMAGE/a0f87f7e-434d-4c3c-9584-f7ee351d5f64-10432-dubai-img-worlds-of-adventure---uae-resident-offer-01.jpg?auto=format&w=510.8727272727273&h=401.4&q=90&ar=14%3A11&crop=faces&fit=crop',
    },
    {
      id: 5,
      title: 'Libro 5',
      url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.imgacademy.com%2F&psig=AOvVaw3gltVG-0o192BWjcWU64Ei&ust=1758368683739000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCICy543g5I8DFQAAAAAdAAAAABAK',
    },
    {
      id: 6,
      title: 'Libro 6',
      url: 'https://cdn-imgix.headout.com/tour/19364/TOUR-IMAGE/a0f87f7e-434d-4c3c-9584-f7ee351d5f64-10432-dubai-img-worlds-of-adventure---uae-resident-offer-01.jpg?auto=format&w=510.8727272727273&h=401.4&q=90&ar=14%3A11&crop=faces&fit=crop',
    },
    {
      id: 7,
      title: 'Libro 7',
      url: 'https://cdn-imgix.headout.com/tour/19364/TOUR-IMAGE/a0f87f7e-434d-4c3c-9584-f7ee351d5f64-10432-dubai-img-worlds-of-adventure---uae-resident-offer-01.jpg?auto=format&w=510.8727272727273&h=401.4&q=90&ar=14%3A11&crop=faces&fit=crop',
    },
  ];
  visibleBooks: any[] = [];
  private startIndex = 0;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.cols$ = this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
      .pipe(
        map((result) => {
          let cols = 0;
          if (result.breakpoints[Breakpoints.XSmall]) {
            cols = 1;
          }
          if (result.breakpoints[Breakpoints.Small]) {
            cols = 2;
          }
          if (result.breakpoints[Breakpoints.Medium]) {
            cols = 3;
          }
          if (result.breakpoints[Breakpoints.Large]) {
            cols = 4;
          }
          this.visibleBooks = this.books.slice(0, cols);

          return cols;
        }),
        shareReplay()
      );
  }

  scroll(direction: string) {
    let cols = 0;
    this.cols$?.subscribe((c) => (cols = c)).unsubscribe();

    if (direction === 'right') {
      this.startIndex = (this.startIndex + 1) % this.books.length;
    } else if (direction === 'left') {
      this.startIndex = (this.startIndex - 1 + this.books.length) % this.books.length;
    }

    this.updateVisibleBooks(cols);
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
