import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input } from '@angular/core';
import { map, shareReplay } from 'rxjs';

@Component({
  selector: 'app-card-book',
  standalone: false,
  templateUrl: './card-book.html',
  styleUrl: './card-book.css'
})
export class CardBook {

  @Input() book: any;
  linesToShow = 3;

  constructor(private breakpointObserver: BreakpointObserver) { }
  
   ngOnInit() {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large
    ]).pipe(
      map(result => {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.linesToShow = 2;
        } else if (result.breakpoints[Breakpoints.Small]) {
          this.linesToShow = 3;
        } else {
          this.linesToShow = 4;
        }
        
        return 0;
      }),
      shareReplay()
    ).subscribe();
  }
}
