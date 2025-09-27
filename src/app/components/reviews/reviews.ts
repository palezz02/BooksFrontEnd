import { Component, Input } from '@angular/core';

interface Review {
  reviewer: string;
  rating: number;
  title: string;
  text: string;
  // like/dislike counts can be added here if needed
}

@Component({
  selector: 'app-reviews',
  standalone: false,
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class Reviews {
  @Input() reviews: Review[] = [];

  currentIndex = 0;

  get averageRating(): number {
    if (!this.reviews.length) return 0;
    return this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length;
  }

  get visibleReviews(): Review[] {
    return this.reviews.slice(this.currentIndex, this.currentIndex + 3);
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
    }
  }

  next() {
    if (this.currentIndex < this.reviews.length - 3) {
      this.currentIndex += 1;
    }
  }
}
