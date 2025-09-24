import { Component } from '@angular/core';
import { Book } from '../book-info/book-info';

export class book {
  constructor(
    public title: string,
    public author: string,
    public category: string[],
    public year: number,
    public description: string,
    public price: number,
    public imageUrl: string
  ) {}
}
export interface OrderItem {
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  stock: number;
  price: number;
  updatedAt: Date;
  book: Book;
  orderItem: OrderItem[];
}
@Component({
  selector: 'cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartInfo {
  cart: Cart = {
    stock: 1,
    price: 12.6,
    updatedAt: new Date(),
    book: {
      title: 'Le avventure di Kiwi',
      publisher: 'Salani',
      author: 'Kiwi',
      category: ['Avventura', 'Fantasy'],
      year: 2023,
      description: 'Lorem ipsum...',
      price: 19.99,
      imageUrl: 'https://covers.openlibrary.org/b/oclc/28419896-L.jpg',
    },
    orderItem: [
      { quantity: 1, price: 29.99, subtotal: 2 * 29.99 },
      { quantity: 1, price: 29.99, subtotal: 2 * 29.99 },
    ],
  };

  increaseQuantity(index: number): void {
    this.cart.orderItem[index].quantity++;
    this.updateSubtotal(index);
  }

  decreaseQuantity(index: number): void {
    if (this.cart.orderItem[index].quantity > 1) {
      this.cart.orderItem[index].quantity--;
      this.updateSubtotal(index);
    } else {
      this.removeItem(index);
    }
  }

  updateSubtotal(index: number): void {
    const item = this.cart.orderItem[index];
    item.subtotal = item.quantity * item.price;
  }

  removeItem(index: number): void {
    this.cart.orderItem.splice(index, 1);
  }

  getTotal(): number {
    return this.cart.orderItem.reduce((sum, item) => sum + item.subtotal, 0);
  }
  getQuantity(): number {
    return this.cart.orderItem.reduce((sum, item) => sum + item.quantity, 0);
  }
}
