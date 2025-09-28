import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { InventoryService } from '../../services/inventory-service';
import { BookService } from '../../services/book-service';
import { OrderItemServiceService } from '../../services/order-item-service.service';

@Component({
  selector: 'cart',
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  standalone: false,
})
export class CartInfo implements OnInit {
  cartItems: any[] = [];
  isLoading = true;

  constructor(
    private inventoryService: InventoryService,
    private bookService: BookService,
    private orderItemService: OrderItemServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCartFromInventory();
  }

  loadCartFromInventory(): void {
    this.isLoading = true;
    
    this.inventoryService.getAll().subscribe({
      next: (response) => {
        if (response.rc && response.dati) {
          this.processInventoryData(response.dati);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading inventory:', error);
        this.isLoading = false;
      }
    });
  }

  processInventoryData(inventories: any[]): void {
    this.cartItems = [];
    
    inventories.forEach(inventory => {
      if (inventory.bookId) {
        this.bookService.getById(inventory.bookId).subscribe({
          next: (bookResponse) => {
            if (bookResponse.rc && bookResponse.dati) {
              const book = bookResponse.dati;
              
              if (inventory.orderItem && inventory.orderItem.length > 0) {
                inventory.orderItem.forEach((orderItemId: number) => {
                  this.orderItemService.getOrderItem(orderItemId).subscribe({
                    next: (orderItemResponse) => {
                      if (orderItemResponse.rc && orderItemResponse.dati) {
                        const orderItem = orderItemResponse.dati;
                        
                        const cartItem = {
                          inventory: inventory,
                          book: book,
                          orderItem: orderItem,
                          quantity: orderItem.quantity,
                          unitPrice: orderItem.unitPrice,
                          subtotal: orderItem.subtotal
                        };
                        
                        this.cartItems.push(cartItem);
                      }
                    }
                  });
                });
              }
            }
          },
          error: (error) => {
            console.error('Error loading book:', error);
          }
        });
      }
    });
  }

  increaseQuantity(cartItem: any): void {
    if (cartItem.quantity >= cartItem.inventory.stock) {
      alert('Not enough stock available');
      return;
    }

    const newQuantity = cartItem.quantity + 1;
    const newSubtotal = newQuantity * cartItem.unitPrice;

    const updateReq = {
      id: cartItem.orderItem.id,
      orderId: cartItem.orderItem.orderId,
      inventoryId: cartItem.orderItem.inventory,
      quantity: newQuantity
    };

    const originalQuantity = cartItem.quantity;
    const originalSubtotal = cartItem.subtotal;
    
    cartItem.quantity = newQuantity;
    cartItem.subtotal = newSubtotal;
    cartItem.orderItem.quantity = newQuantity;
    cartItem.orderItem.subtotal = newSubtotal;

    this.cartItems = [...this.cartItems];
    this.cdr.detectChanges();

    this.orderItemService.updateOrderItem(updateReq).subscribe({
      next: (response) => {
        if (response.rc) {
          console.log('Quantity updated successfully');
        } else {
          cartItem.quantity = originalQuantity;
          cartItem.subtotal = originalSubtotal;
          cartItem.orderItem.quantity = originalQuantity;
          cartItem.orderItem.subtotal = originalSubtotal;
          this.cartItems = [...this.cartItems];
          this.cdr.detectChanges();
          alert('Error updating quantity: ' + response.msg);
        }
      },
      error: (error) => {
        cartItem.quantity = originalQuantity;
        cartItem.subtotal = originalSubtotal;
        cartItem.orderItem.quantity = originalQuantity;
        cartItem.orderItem.subtotal = originalSubtotal;
        this.cartItems = [...this.cartItems];
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
      inventoryId: cartItem.orderItem.inventory,
      quantity: newQuantity
    };

    const originalQuantity = cartItem.quantity;
    const originalSubtotal = cartItem.subtotal;
    
    cartItem.quantity = newQuantity;
    cartItem.subtotal = newSubtotal;
    cartItem.orderItem.quantity = newQuantity;
    cartItem.orderItem.subtotal = newSubtotal;

    this.cartItems = [...this.cartItems];

    this.orderItemService.updateOrderItem(updateReq).subscribe({
      next: (response) => {
        if (response.rc) {
          console.log('Quantity updated successfully');
        } else {
          cartItem.quantity = originalQuantity;
          cartItem.subtotal = originalSubtotal;
          cartItem.orderItem.quantity = originalQuantity;
          cartItem.orderItem.subtotal = originalSubtotal;
          this.cartItems = [...this.cartItems];
          alert('Error updating quantity: ' + response.msg);
        }
      },
      error: (error) => {
        cartItem.quantity = originalQuantity;
        cartItem.subtotal = originalSubtotal;
        cartItem.orderItem.quantity = originalQuantity;
        cartItem.orderItem.subtotal = originalSubtotal;
        this.cartItems = [...this.cartItems];
        console.error('Error updating quantity:', error);
        alert('Error updating quantity');
      }
    });
  }

  removeItem(cartItem: any): void {
   const deleteReq = {
  id: cartItem.orderItem?.id,
  orderId: cartItem.orderItem?.orderId,
  inventoryId: cartItem.inventory?.id,
  quantity: cartItem.quantity
};


    console.log('deleteReq being sent', deleteReq);

    const originalIndex = this.cartItems.indexOf(cartItem);
    if (originalIndex > -1) {
      this.cartItems.splice(originalIndex, 1);
      this.cartItems = [...this.cartItems];
    }
    this.cdr.markForCheck();
    this.orderItemService.removeOrderItem(deleteReq).subscribe({
      next: (response) => {
        if (response.rc) {
          console.log('Item removed successfully');
        } else {
          if (originalIndex > -1) {

            this.cartItems.splice(originalIndex, 0, cartItem);
            this.cartItems = [...this.cartItems];
                        this.cdr.markForCheck();

          }
         this.cdr.markForCheck();

          alert('Error removing item: ' + response.msg);
        }
      },
      error: (error) => {
        if (originalIndex > -1) {
          this.cartItems.splice(originalIndex, 0, cartItem);
          this.cartItems = [...this.cartItems];
        }
        console.error('Error removing item:', error);
        alert('Error removing item');
      }
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.subtotal, 0);
  }

  getQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  refreshCart(): void {
    console.log('Refreshing cart...');
    this.loadCartFromInventory();
  }


  trackByCartItem(index: number, item: any): any {
    return item.orderItem?.id || index;
  }

  placeOrder(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    console.log('Placing order for:', this.cartItems);
    alert('Order placed successfully!');
    
    // After successful order, you might want to clear the cart
    // or redirect to order confirmation page
  }
}