import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService, CreatePaymentIntentReq } from '../../services/payment-service';
import { UserService } from '../../services/user-service';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { AuthService } from '../../auth/authService';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
  standalone: false,
})
export class CheckoutComponent implements OnInit {
  @ViewChild('cardElement') cardElement!: ElementRef;

  stripe: Stripe | null = null;
  elements: any;
  card: any;
  clientSecret = '';
  isProcessing = false;
  paymentComplete = false;
  paymentError = '';
  customerEmail = '';
  orderId?: number;

  cartItems: any[] = [];
  totalAmount = 0;

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private auth: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.stripe = await loadStripe('pk_test_your_publishable_key_here');
    this.elements = this.stripe?.elements();

    this.loadCartData();

    setTimeout(() => this.setupStripeElements(), 100);
  }

  loadCartData(): void {
    const userId = this.auth.getUserId();

    if (userId === -1) {
      this.router.navigate(['/cart']);
      return;
    }

    this.userService.getCartBooks(userId).subscribe({
      next: (response) => {
        if (response.rc && response.dati) {
          this.cartItems = response.dati.map((item: any) => ({
            ...item,
            subtotal: item.unitPrice * item.quantity,
          }));
          this.calculateTotal();

          this.cd.detectChanges();
        } else {
          this.router.navigate(['/cart']);
        }
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.router.navigate(['/cart']);
      },
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => total + item.subtotal, 0);
  }

  setupStripeElements(): void {
    if (!this.elements) return;

    this.card = this.elements.create('card', {
      style: {
        base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
        invalid: { color: '#9e2146' },
      },
    });

    this.card.mount(this.cardElement.nativeElement);

    this.card.on('change', (event: any) => {
      this.paymentError = event.error?.message || '';
      this.cd.detectChanges();
    });
  }

  async processPayment(): Promise<void> {
    if (!this.customerEmail.includes('@')) {
      this.paymentError = 'Please enter a valid email address';
      return;
    }

    if (this.totalAmount <= 0) {
      this.paymentError = 'Invalid amount';
      return;
    }

    if (!this.stripe) {
      this.paymentError = 'Payment system not initialized';
      return;
    }

    this.isProcessing = true;
    this.paymentError = '';

    try {
      const paymentIntentReq: CreatePaymentIntentReq = {
        amount: this.totalAmount,
        currency: 'EUR',
        customerEmail: this.customerEmail,
        description: `Order for ${this.cartItems.length} books`,
        orderId: this.orderId,
      };

      const response = await this.paymentService.createPaymentIntent(paymentIntentReq).toPromise();
      if (!response?.rc || !response.dati)
        throw new Error(response?.msg || 'Failed to create payment intent');

      this.clientSecret = response.dati.clientSecret;
      const paymentIntentId = response.dati.paymentIntentId;

      const result = await this.stripe.confirmCardPayment(this.clientSecret, {
        payment_method: { card: this.card, billing_details: { email: this.customerEmail } },
      });

      if (result.error) throw new Error(result.error.message);

      const confirmResponse = await this.paymentService
        .confirmPayment(paymentIntentId, this.orderId)
        .toPromise();
      if (!confirmResponse?.rc)
        throw new Error(confirmResponse?.msg || 'Failed to confirm payment');

      this.paymentComplete = true;
      this.snackBar.open('Payment successful! Your order has been processed.', 'Close', {
        duration: 5000,
      });

      setTimeout(
        () =>
          this.router.navigate(['/order-success'], {
            queryParams: { paymentIntentId: result.paymentIntent!.id },
          }),
        3000
      );
    } catch (err: any) {
      this.paymentError = err.message || 'Payment failed';
      console.error(err);
    } finally {
      this.isProcessing = false;
      this.cd.detectChanges();
    }
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }
}
