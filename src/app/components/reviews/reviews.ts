import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../services/review-service';

@Component({
  selector: 'app-reviews',
  standalone: false,
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class Reviews {
  @Input() reviews: any[] = [];

  currentIndex = 0;
  hover = false;
  showReviewForm: boolean = false;
  reviewForm: FormGroup;

  constructor(private fb: FormBuilder, private reviewService: ReviewService) {
    this.reviewForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
    });
  }

  get averageRating(): number {
    if (!this.reviews.length) return 0;
    return this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length;
  }

  get visibleReviews(): any[] {
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

  submitReview() {
    // Da implementare: invio della recensione
    // Esempio: console.log(this.reviewForm.value);
    this.reviewService.create(this.reviewForm.value).subscribe((res) => {
      // Gestisci la risposta positiva
    });
  }
}
