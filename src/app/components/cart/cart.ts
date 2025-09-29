import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user-service';
import { OrderItemServiceService } from '../../services/order-item-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cart',
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  standalone: false,
})
export class CartInfo implements OnInit {
  cartItems: any[] = [];
  isLoading = true;
  userId: number | null = null;

  constructor(
    private userService: UserService,
    private orderItemService: OrderItemServiceService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userId = 3;
    this.loadCartFromOrder();
    
    // Alternative: Get from sessionStorage
    // const userIdStr = sessionStorage.getItem('userId');
    // if (userIdStr) {
    //   this.userId = parseInt(userIdStr, 10);
    //   this.loadCartFromOrder();
    // } else {
    //   console.error('No user ID found');
    //   this.isLoading = false;
    // }
  }

  loadCartFromOrder(): void {
    if (!this.userId) {
      console.error('User ID is missing');
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    
    this.userService.getCartBooks(this.userId).subscribe({
      next: (response) => {
        if (response.rc && response.dati) {
          this.processCartData(response.dati);
        } else {
          console.warn('No cart data or failed response:', response.msg);
          this.cartItems = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.cartItems = [];
        this.isLoading = false;
      }
    });
  }

  processCartData(cartBooks: any[]): void {
    this.cartItems = cartBooks.map(item => ({
      orderItem: {
        id: item.orderId,
        orderId: item.orderId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
        inventory: item.bookId 
      },
      book: {
        id: item.bookId,
        title: item.title,
        description: item.description,
        coverImage: item.coverImage,
        publicationDate: item.publicationDate,
        isbn: item.isbn,
        pageCount: item.pageCount,
        languageCode: item.languageCode,
        edition: item.edition,
        stock: item.stock 
      },
      inventory: {
        id: item.inventoryId,
        stock: item.stock 
      },
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal
    }));
  }

  increaseQuantity(cartItem: any): void {
    const availableStock = cartItem.book?.stock || 0;
    
    if (cartItem.quantity >= availableStock) {
      alert(`Not enough stock available. Only ${availableStock} items in stock.`);
      return;
    }

    const newQuantity = cartItem.quantity + 1;
    const newSubtotal = newQuantity * cartItem.unitPrice;

    const updateReq = {
      id: cartItem.orderItem.id,
      orderId: cartItem.orderItem.orderId,
      inventoryId: cartItem.inventory?.id || cartItem.orderItem.inventory,
      quantity: newQuantity
    };

    const originalQuantity = cartItem.quantity;
    const originalSubtotal = cartItem.subtotal;
    
    // Optimistically update UI
    cartItem.quantity = newQuantity;
    cartItem.subtotal = newSubtotal;
    cartItem.orderItem.quantity = newQuantity;
    cartItem.orderItem.subtotal = newSubtotal;

    this.cdr.detectChanges();

    this.orderItemService.updateOrderItem(updateReq).subscribe({
      next: (response) => {
        if (!response.rc) {
          // Revert on failure
          cartItem.quantity = originalQuantity;
          cartItem.subtotal = originalSubtotal;
          cartItem.orderItem.quantity = originalQuantity;
          cartItem.orderItem.subtotal = originalSubtotal;
          this.cdr.detectChanges();
          alert('Error updating quantity: ' + response.msg);
        }
      },
      error: (error) => {
        // Revert on error
        cartItem.quantity = originalQuantity;
        cartItem.subtotal = originalSubtotal;
        cartItem.orderItem.quantity = originalQuantity;
        cartItem.orderItem.subtotal = originalSubtotal;
        this.cdr.detectChanges();
        console.error('Error updating quantity:', error);
        alert('Error updating quantity');
      }
    });
  }

  decreaseQuantity(cartItem: any): void {
    if (cartItem.quantity <= 1) {
      this.removeItem(cartItem);
      return;
    }

    const newQuantity = cartItem.quantity - 1;
    const newSubtotal = newQuantity * cartItem.unitPrice;

    const updateReq = {
      id: cartItem.orderItem.id,
      orderId: cartItem.orderItem.orderId,
      inventoryId: cartItem.inventory?.id || cartItem.orderItem.inventory,
      quantity: newQuantity
    };

    const originalQuantity = cartItem.quantity;
    const originalSubtotal = cartItem.subtotal;
    
    // Optimistically update UI
    cartItem.quantity = newQuantity;
    cartItem.subtotal = newSubtotal;
    cartItem.orderItem.quantity = newQuantity;
    cartItem.orderItem.subtotal = newSubtotal;

    this.cdr.detectChanges();

    this.orderItemService.updateOrderItem(updateReq).subscribe({
      next: (response) => {
        if (!response.rc) {
          cartItem.quantity = originalQuantity;
          cartItem.subtotal = originalSubtotal;
          cartItem.orderItem.quantity = originalQuantity;
          cartItem.orderItem.subtotal = originalSubtotal;
          this.cdr.detectChanges();
          alert('Error updating quantity: ' + response.msg);
        }
      },
      error: (error) => {
        cartItem.quantity = originalQuantity;
        cartItem.subtotal = originalSubtotal;
        cartItem.orderItem.quantity = originalQuantity;
        cartItem.orderItem.subtotal = originalSubtotal;
        this.cdr.detectChanges();
        console.error('Error updating quantity:', error);
        alert('Error updating quantity');
      }
    });
  }

  removeItem(cartItem: any): void {
    const deleteReq = {
      id: cartItem.orderItem.id,
      orderId: cartItem.orderItem.orderId,
      inventoryId: cartItem.inventory?.id || cartItem.orderItem.inventory,
      quantity: cartItem.quantity
    };

    const originalIndex = this.cartItems.indexOf(cartItem);
    const removedItem = this.cartItems[originalIndex];
    
    if (originalIndex > -1) {
      this.cartItems.splice(originalIndex, 1);
      this.cartItems = [...this.cartItems];
      this.cdr.detectChanges();
    }

    this.orderItemService.removeOrderItem(deleteReq).subscribe({
      next: (response) => {
        if (!response.rc) {
          if (originalIndex > -1) {
            this.cartItems.splice(originalIndex, 0, removedItem);
            this.cartItems = [...this.cartItems];
            this.cdr.detectChanges();
          }
          alert('Error removing item: ' + response.msg);
        }
      },
      error: (error) => {
        if (originalIndex > -1) {
          this.cartItems.splice(originalIndex, 0, removedItem);
          this.cartItems = [...this.cartItems];
          this.cdr.detectChanges();
        }
        console.error('Error removing item:', error);
        alert('Error removing item');
      }
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.subtotal || 0), 0);
  }

  getQuantity(): number {
    return this.cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  }

  refreshCart(): void {
    this.loadCartFromOrder();
  }

  trackByCartItem(index: number, item: any): any {
    return item.orderItem?.id || index;
  }

  isLowStock(cartItem: any): boolean {
    const stock = cartItem.book?.stock || 0;
    return stock > 0 && stock < 5;
  }

  isOutOfStock(cartItem: any): boolean {
    const stock = cartItem.book?.stock || 0;
    return stock <= 0;
  }

  getAvailableStock(cartItem: any): number {
    return cartItem.book?.stock || 0;
  }

  placeOrder(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const outOfStockItems = this.cartItems.filter(item => this.isOutOfStock(item));
    if (outOfStockItems.length > 0) {
      alert('Some items in your cart are out of stock. Please remove them before proceeding.');
      return;
    }

    const invalidQuantityItems = this.cartItems.filter(item => 
      item.quantity > this.getAvailableStock(item)
    );
    if (invalidQuantityItems.length > 0) {
      alert('Some items in your cart exceed available stock. Please adjust quantities before proceeding.');
      return;
    }

    this.router.navigate(['/checkout']);
  }
}