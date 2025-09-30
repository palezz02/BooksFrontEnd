import { Component, HostListener, Inject, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { UserService } from '../services/user-service';
import { OrderItemServiceService } from '../services/order-item-service.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-new-cart',
  standalone: false,
  templateUrl: './new-cart.html',
  styleUrl: './new-cart.css',
})
export class NewCart implements OnDestroy {
  private _snackBar = inject(MatSnackBar);
  isLoading = true;
  cartItems: any[] = [];
  originalItems: any[] = [];

  constructor(
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private orderItemService: OrderItemServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userId = Number(localStorage.getItem('userId')) || -1;
      this.userService.getCartBooks(userId).subscribe({
        next: (res) => {
          this.cartItems = (res.dati || []).map((item) => ({
            ...item,
            subtotal: item.unitPrice * item.quantity,
          }));
          this.originalItems = JSON.parse(JSON.stringify(this.cartItems));
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  getQuantity() {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotal() {
    return this.cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }

  // Aggiorna su chiusura browser/tab
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
    this.checkAndUpdateQuantities();
  }

  // Aggiorna su cambio pagina Angular
  ngOnDestroy() {
    this.checkAndUpdateQuantities();
  }

  checkAndUpdateQuantities() {
    this.cartItems.forEach((item, idx) => {
      const original = this.originalItems[idx];
      if (item.quantity !== original.quantity) {
        this.orderItemService
          .updateOrderItem({
            id: item.orderItemId,
            orderId: item.orderId,
            inventoryId: item.inventoryId,
            quantity: item.quantity,
          })
          .subscribe();
      }
    });
  }

  removeItem(item: any) {
    console.log(item.orderItemId, item.inventoryId);
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
            // Rimuove l'elemento dalla lista cartItems
            this.cartItems = this.cartItems.filter((i) => i.orderItemId !== item.orderItemId);
            this._snackBar.open('Libro rimosso dal carrello', 'Chiudi', { duration: 3000 });
          }
        },
        error: (err) => {
          console.error(err);
          this._snackBar.open('Errore nella rimozione del libro dal carrello', 'Chiudi', {
            duration: 3000,
          });
        },
      });
  }

  addQuantity(item: any) {
    if (item.quantity < item.stock) {
      item.quantity = item.quantity + 1;
      item.subtotal = item.unitPrice * item.quantity;
    }
  }

  removeQuantity(item: any) {
    if (item.quantity > 0) {
      item.quantity = item.quantity - 1;
      item.subtotal = item.unitPrice * item.quantity;
    }
  }

  placeOrder(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const outOfStockItems = this.cartItems.filter((item) => item.stock === 0);
    if (outOfStockItems.length > 0) {
      alert('Error: Out of stock items in your cart. Please remove them.');
      return;
    }

    const invalidQuantityItems = this.cartItems.filter((item) => item.quantity > item.stock);
    if (invalidQuantityItems.length > 0) {
      alert('Error: Not enough stock for some items. Please adjust quantities accordingly.');
      return;
    }

    this.router.navigate(['/checkout']);
  }
}
