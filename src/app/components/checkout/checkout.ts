// checkout.component.ts - FIXED
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService, CreatePaymentIntentReq } from '../../services/payment-service';
import { InventoryService } from '../../services/inventory-service';
import { BookService } from '../../services/book-service';
import { OrderItemServiceService } from '../../services/order-item-service.service';
import { OrderService } from '../../services/order-service';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { UserService } from '../../services/user-service';

declare var Stripe: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
  standalone: false
})
export class CheckoutComponent implements OnInit {
  @ViewChild('cardElement') cardElement!: ElementRef;

//   stripe: any;
  elements: any;
  card: any;
  clientSecret: string = '';
  isProcessing = false;
  paymentComplete = false;
  paymentError = '';
stripe: Stripe | null = null;
  // Order details
  cartItems: any[] = [];
  totalAmount = 0;
  customerEmail = '';
  orderId?: number;

  constructor(
    private paymentService: PaymentService,
    private inventoryService: InventoryService,
    private bookService: BookService,
    private orderItemService: OrderItemServiceService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService,
  ) {}

  async ngOnInit(): Promise<void> {
    // Carica Stripe in modo asincrono:
    this.stripe = await loadStripe('pk_test_your_publishable_key_here');
    this.elements = this.stripe?.elements();
    
    this.loadCartData();
    
    setTimeout(() => {
      this.setupStripeElements();
    }, 100);
  }

  loadCartData(): void {
    const userId = Number(localStorage.getItem('userId')) || -1;

    if (userId === -1) {
      this.router.navigate(['/cart']);
      return;
    }

    this.userService.getCartBooks(userId).subscribe({
      next: (response) => {
        if (response.rc && response.dati) {
          this.cartItems = response.dati.map((item: any) => ({
            ...item,
            subtotal: item.unitPrice * item.quantity
          }));
          this.calculateTotal();
        } else {
          this.router.navigate(['/cart']);
        }
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.router.navigate(['/cart']);
      }
    });
  }


  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => total + item.subtotal, 0);
  }


  setupStripeElements(): void {
    // Create card element
    this.card = this.elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      },
    });

    // Mount card element
    this.card.mount(this.cardElement.nativeElement);

    // Handle card errors
    this.card.on('change', (event: any) => {
      if (event.error) {
        this.paymentError = event.error.message;
      } else {
        this.paymentError = '';
      }
    });
  }

 async processPayment(): Promise<void> {
  if (!this.customerEmail || !this.customerEmail.includes('@')) {
    this.paymentError = 'Please enter a valid email address';
    return;
  }

  if (this.totalAmount <= 0) {
    this.paymentError = 'Invalid amount';
    return;
  }

  // Check se Stripe è stato caricato
  if (!this.stripe) {
    this.paymentError = 'Payment system not initialized';
    return;
  }

  this.isProcessing = true;
  this.paymentError = '';

  try {
    // Step 1: Create payment intent
    const paymentIntentReq: CreatePaymentIntentReq = {
      amount: this.totalAmount,
      currency: 'EUR',
      customerEmail: this.customerEmail,
      description: `Order for ${this.cartItems.length} books`,
      orderId: this.orderId
    };

    const response = await this.paymentService.createPaymentIntent(paymentIntentReq).toPromise();
    
    if (!response?.rc || !response.dati) {
      throw new Error(response?.msg || 'Failed to create payment intent');
    }

    this.clientSecret = response.dati.clientSecret;
    const paymentIntentId = response.dati.paymentIntentId;

    // Step 2: Confirm payment with Stripe
    const result = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.card,
        billing_details: {
          email: this.customerEmail,
        },
      }
    });

    if (result.error) {
      this.paymentError = result.error.message || 'Payment failed';
      this.isProcessing = false;
      return;
    }

    if (!result.paymentIntent) {
      this.paymentError = 'Payment failed';
      this.isProcessing = false;
      return;
    }

    // Step 3: Confirm payment on backend
    const confirmResponse = await this.paymentService.confirmPayment(paymentIntentId, this.orderId).toPromise();
    
    if (confirmResponse?.rc) {
      this.paymentComplete = true;
      this.showSuccessMessage('Payment successful! Your order has been processed.');
      
      // Redirect to success page after delay
      setTimeout(() => {
        this.router.navigate(['/order-success'], { 
          queryParams: { paymentIntentId: result.paymentIntent!.id } 
        });
      }, 3000);
    } else {
      throw new Error(confirmResponse?.msg || 'Failed to confirm payment');
    }

  } catch (error: any) {
    this.paymentError = error.message || 'Payment failed. Please try again.';
    console.error('Payment error:', error);
  } finally {
    this.isProcessing = false;
  }
}

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }
}