import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../services/user-service';
import { OrderItemServiceService } from '../../services/order-item-service.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

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
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // localStorage.setItem('userId', '3')
      const userIdStr = localStorage.getItem('userId');
      console.log('UserId from localStorage:', userIdStr);
      
      if (userIdStr) {
        this.userId = parseInt(userIdStr, 10);
        console.log('Parsed userId:', this.userId);
        this.loadCartFromOrder();
      } else {
        console.error('No user ID found in localStorage.');
        this.isLoading = false;
      }
    } else {
      console.log('Not running in browser — skipping localStorage');
      this.isLoading = false;
    }
  }

  loadCartFromOrder(): void {
    if (!this.userId) {
      console.error('User ID is missing');
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    console.log('Loading cart for user:', this.userId);
    
    setTimeout(() => {
      if (this.isLoading) {
        console.error('Loading timeout - forcing stop');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }, 10000);
    
    this.userService.getById(this.userId).pipe(
      switchMap((userResp: any) => {
        if (!userResp.rc || !userResp.dati || !userResp.dati.orders || userResp.dati.orders.length === 0) {
          console.warn('No orders found for user');
          this.cartItems = [];
          this.isLoading = false;
          this.cdr.detectChanges();
          return of(null);
        }
        
        const userOrderIds = userResp.dati.orders;
        console.log('User order IDs:', userOrderIds);
        
        return this.http.get<any>('http://localhost:8080/rest/order/getAll').pipe(
          switchMap((ordersResponse: any) => {
            if (!ordersResponse.rc || !ordersResponse.dati || ordersResponse.dati.length === 0) {
              this.cartItems = [];
              this.isLoading = false;
              this.cdr.detectChanges();
              return of(null);
            }
            
            const userOrders = ordersResponse.dati.filter((order: any) => 
              userOrderIds.includes(order.id) &&
              (order.status === 'PROCESSING' || order.status === 'PENDING' || order.status === 'CART')
            );
            
            if (userOrders.length === 0) {
              console.warn('No cart orders found');
              this.cartItems = [];
              this.isLoading = false;
              this.cdr.detectChanges();
              return of(null);
            }
            
            const cartOrder = userOrders[0];
            const orderItemIds = cartOrder.orderItem || [];
            
            if (orderItemIds.length === 0) {
              console.warn('Cart is empty');
              this.cartItems = [];
              this.isLoading = false;
              this.cdr.detectChanges();
              return of(null);
            }
            
            const itemRequests = orderItemIds.map((itemId: number) => 
              this.orderItemService.getOrderItem(itemId).pipe(
                catchError(err => {
                  console.error(`Error loading order item ${itemId}:`, err);
                  return of(null);
                })
              )
            );
            
            return forkJoin([
              forkJoin(itemRequests),
              this.http.get<any>('http://localhost:8080/rest/book/getAll')
            ]);
          })
        );
      })
    ).subscribe({
      next: (data: any) => {
        if (!data) return;
        
        const [itemResponses, booksResponse] = data;
        
        console.log('Full books response:', booksResponse);
        console.log('Books array:', booksResponse.dati);
        if (booksResponse.dati && booksResponse.dati.length > 0) {
          console.log('First book structure:', booksResponse.dati[0]);
        }
        
        if (!booksResponse.rc || !booksResponse.dati) {
          console.error('Failed to load books');
          this.cartItems = [];
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }
        
        const allBooks = booksResponse.dati;
        
        const validItems = itemResponses.filter((resp: any) => resp && resp.rc && resp.dati);
        console.log('Valid order items:', validItems);
        console.log('Inventory IDs we need:', validItems.map((item: any) => item.dati.inventory));
        
        this.cartItems = validItems.map((itemResp: any) => {
          const orderItem = itemResp.dati;
          const inventoryId = orderItem.inventory;
          
          console.log('Looking for book with inventory:', inventoryId);
          
          const book = allBooks.find((b: any) => {
            console.log('Checking book:', b.id, 'fields:', Object.keys(b));
            return b.id === inventoryId || 
                   (b.inventory && b.inventory === inventoryId) ||
                   (b.inventoryId && b.inventoryId === inventoryId);
          });
          
          if (!book) {
            console.warn(`No book found for inventory ${inventoryId}`);
            return null;
          }
          
          console.log('Found book:', book);
          
          return {
            orderItem: {
              id: orderItem.id,
              orderId: orderItem.orderId,
              quantity: orderItem.quantity,
              unitPrice: orderItem.unitPrice,
              subtotal: orderItem.subtotal,
              inventory: orderItem.inventory
            },
            book: {
              id: book.id,
              title: book.title,
              description: book.description,
              coverImage: book.coverImage,
              publicationDate: book.publicationDate,
              isbn: book.isbn,
              pageCount: book.pageCount,
              languageCode: book.languageCode,
              edition: book.edition,
              stock: book.stock || 0
            },
            quantity: orderItem.quantity,
            unitPrice: orderItem.unitPrice,
            subtotal: orderItem.subtotal
          };
        }).filter((item: any) => item !== null);
        
        console.log('Final cart items:', this.cartItems);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading cart:', error);
        this.cartItems = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
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
      inventoryId: cartItem.orderItem.inventory,
      quantity: newQuantity
    };

    const originalQuantity = cartItem.quantity;
    const originalSubtotal = cartItem.subtotal;
    
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
      inventoryId: cartItem.orderItem.inventory,
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