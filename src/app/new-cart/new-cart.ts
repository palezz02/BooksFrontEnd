import { Component, inject, Inject } from '@angular/core';
import { UserService } from '../services/user-service';
import { OrderItemServiceService } from '../services/order-item-service.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-new-cart',
  standalone: false,
  templateUrl: './new-cart.html',
  styleUrl: './new-cart.css',
})
export class NewCart {
  private _snackBar = inject(MatSnackBar);

  cartItems$!: Observable<any[]>;

  constructor(
    private userService: UserService,
    private orderItemService: OrderItemServiceService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userId = Number(localStorage.getItem('userId')) || -1;

      this.cartItems$ = this.userService.getCartBooks(userId).pipe(
        map((res) =>
          (res.dati || []).map((item: any) => ({
            ...item,
            subtotal: item.unitPrice * item.quantity,
          }))
        ),
        catchError(() => of([]))
      );
    } else {
      this.cartItems$ = of([]);
    }
  }

  getQuantity(items: any[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotal(items: any[]): number {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  }

  removeItem(item: any) {
    this.orderItemService
      .removeOrderItem({
        id: item.orderItemId,
        orderId: item.orderId,
        inventoryId: item.inventoryId,
        quantity: item.quantity,
      })
      .subscribe({
        next: (res) => {
          if (res.rc) {
            this._snackBar.open('Libro rimosso dal carrello', 'Chiudi', { duration: 3000 });
            this.ngOnInit();
          }
        },
        error: () => {
          this._snackBar.open('Errore nella rimozione del libro dal carrello', 'Chiudi', {
            duration: 3000,
          });
        },
      });
  }

  addQuantity(item: any) {
    if (item.quantity < item.stock) {
      item.quantity++;
      item.subtotal = item.unitPrice * item.quantity;
    }
  }

  removeQuantity(item: any) {
    if (item.quantity > 0) {
      item.quantity--;
      item.subtotal = item.unitPrice * item.quantity;
    }
  }

  placeOrder(items: any[]): void {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const outOfStockItems = items.filter((item) => item.stock === 0);
    if (outOfStockItems.length > 0) {
      alert('Error: Out of stock items in your cart. Please remove them.');
      return;
    }

    const invalidQuantityItems = items.filter((item) => item.quantity > item.stock);
    if (invalidQuantityItems.length > 0) {
      alert('Error: Not enough stock for some items. Please adjust quantities accordingly.');
      return;
    }

    this.router.navigate(['/checkout']);
  }
}
