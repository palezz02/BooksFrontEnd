import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory-service';
import { BookService } from '../../services/book-service';
import { OrderItemServiceService } from '../../services/order-item-service.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  standalone: false,
})
export class CartInfo implements OnInit {
  cartItems: any[] = [];
  isLoading = true;
  isProcessingOrder = false;

  constructor(
    private inventoryService: InventoryService,
    private bookService: BookService,
    private orderItemService: OrderItemServiceService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    
    // Load all order items (this represents the cart)
    this.orderItemService.listOrderItems().subscribe({
      next: (response) => {
        if (response.rc) {
          this.processOrderItems(response.dati);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.isLoading = false;
      }
    });
  }

  processOrderItems(orderItems: any[]): void {
    this.cartItems = [];
    
    orderItems.forEach(orderItem => {
      // Get inventory details for each order item
      this.inventoryService.getById(orderItem.inventory).subscribe({
        next: (inventoryResponse) => {
          if (inventoryResponse.rc) {
            const inventory = inventoryResponse.dati;
            
            // Get book details from inventory
            this.bookService.getById(inventory.bookId).subscribe({
              next: (bookResponse) => {
                if (bookResponse.rc) {
                  const cartItem = {
                    orderItem: orderItem,
                    inventory: inventory,
                    book: bookResponse.dati,
                    quantity: orderItem.quantity,
                    unitPrice: orderItem.unitPrice,
                    subtotal: orderItem.subtotal,
                    stock: inventory.stock
                  };
                  this.cartItems.push(cartItem);
                }
              }
            });
          }
        }
      });
    });
  }

  increaseQuantity(cartItem: any): void {
    if (cartItem.quantity >= cartItem.stock) {
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

    this.orderItemService.updateOrderItem(updateReq).subscribe({
      next: (response) => {
        if (response.rc) {
          cartItem.quantity = newQuantity;
          cartItem.subtotal = newSubtotal;
        } else {
          alert('Error updating quantity: ' + response.msg);
        }
      },
      error: (error) => {
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

    this.orderItemService.updateOrderItem(updateReq).subscribe({
      next: (response) => {
        if (response.rc) {
          cartItem.quantity = newQuantity;
          cartItem.subtotal = newSubtotal;
        } else {
          alert('Error updating quantity: ' + response.msg);
        }
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
        alert('Error updating quantity');
      }
    });
  }

  removeItem(cartItem: any): void {
    const deleteReq = {
      id: cartItem.orderItem.id
    };

    this.orderItemService.removeOrderItem(deleteReq).subscribe({
      next: (response) => {
        if (response.rc) {
          const index = this.cartItems.indexOf(cartItem);
          if (index > -1) {
            this.cartItems.splice(index, 1);
          }
        } else {
          alert('Error removing item: ' + response.msg);
        }
      },
      error: (error) => {
        console.error('Error removing item:', error);
        alert('Error removing item');
      }
    });
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      const removePromises = this.cartItems.map(cartItem => {
        const deleteReq = { id: cartItem.orderItem.id };
        return this.orderItemService.removeOrderItem(deleteReq).toPromise();
      });

      Promise.all(removePromises).then(() => {
        this.cartItems = [];
        alert('Cart cleared successfully');
      }).catch((error) => {
        console.error('Error clearing cart:', error);
        alert('Error clearing cart');
      });
    }
  }

  refreshCart(): void {
    this.loadCart();
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalAmount(): number {
    return this.cartItems.reduce((total, item) => total + item.subtotal, 0);
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    this.isProcessingOrder = true;
    
    // Here you would create an Order and associate all OrderItems with it
    console.log('Processing checkout for items:', this.cartItems);
    
    // Simulate checkout process
    setTimeout(() => {
      this.isProcessingOrder = false;
      alert('Order placed successfully!');
      // After successful order, clear the cart
      this.cartItems = [];
    }, 2000);
  }
}