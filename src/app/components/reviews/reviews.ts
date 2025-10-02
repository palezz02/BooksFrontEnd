import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../services/review-service';
import { AuthService } from '../../auth/authService';
import { title } from 'process';
import { UserService } from '../../services/user-service';

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

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private userService: UserService,
    public auth: AuthService // cambia da private a public
  ) {
    this.reviewForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
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

  setRating(star: number) {
    this.reviewForm.get('rating')?.setValue(star);
    console.log(star);
  }

  submitReview() {
    const review = {
      id: 0,
      bookId: this.reviews[0]?.bookId,
      userId: this.auth.getUserId(),
      rating: this.reviewForm.value.rating,
      title: this.reviewForm.value.title,
      body: this.reviewForm.value.body,
      firstName: '', // aggiungi default
      lastName: '', // aggiungi default
      reviewTitle: this.reviewForm.value.title,
    };
    console.log(review);
    this.userService.getById(this.auth.getUserId()).subscribe((userRes) => {
      if (userRes.rc && userRes.dati) {
        review.firstName = userRes.dati.firstName || '';
        review.lastName = userRes.dati.lastName || '';
      }
      this.reviewService.create(review).subscribe((res) => {
        console.log('Review submitted successfully', res);
        // Inserisci la recensione subito dopo la risposta del backend
        this.reviews = [{ ...review }, ...this.reviews];
        // Resetta il modulo
        this.reviewForm.reset({ rating: 0 });
        // Nascondi il modulo di recensione
        this.showReviewForm = false;
        // Torna all'inizio della lista per mostrare la nuova recensione
        this.currentIndex = 0;
      });
    });
  }
}

// Make sure ReviewService, UserService, and AuthService are all decorated with:
// @Injectable({ providedIn: 'root' })
