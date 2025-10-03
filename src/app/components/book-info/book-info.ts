import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../../services/order-service';
import { OrderItemServiceService } from '../../services/order-item-service.service';
import { AuthService } from '../../auth/authService';

export type Author = {
  id: number;
  fullName: string;
  biography: string;
  birthDate: Date;
  deathDate: Date;
  coverImage?: string;
};

export type Publisher = {
  id: number;
  name: string;
  description: string;
};

export type CategoryDTO = {
  id: number;
  name: string;
};

export type Book = {
  id: number;
  isbn: string;
  title: string;
  pageCount: number;
  description: string;
  coverImage: string;
  languageCode: string;
  publicationDate: string;
  edition: string;
  stock: number;
  price: number;
  publisherName: string;
  publisherDescription: string;
  authors: string[]; 
  authorsFull: Author[];
  cat: string[];
  reviews: any[];
  averageRating: number;
  inventoryId: number;
};

export type CompleteBook = Book;

@Component({
  selector: 'app-book-info',
  standalone: false,
  templateUrl: './book-info.html',
  styleUrl: './book-info.css',
})
export class BookInfo {
  private _snackBar = inject(MatSnackBar);

  @Input() book: CompleteBook | null = null;

  showPublisherPopup: boolean = false;
  publisherData: Publisher | null = null;

  showAuthorPopup: boolean = false;
  authorData: Author | null = null;

  quantity: number = 1;

  constructor(
    private router: Router,
    private userService: UserService,
    private order: OrderService,
    private orderItem: OrderItemServiceService,
    private auth: AuthService
  ) {}

  openPublisherPopup() {
    if (!this.book) return;
    this.publisherData = {
      id: 0,
      name: this.book.publisherName,
      description: this.book.publisherDescription,
    };
    this.showPublisherPopup = true;
  }

  closePublisherPopup() {
    this.showPublisherPopup = false;
  }

  openAuthorPopup(authorName: string) {
    if (!this.book) return;
    const selectedAuthor = this.book.authorsFull?.find((a) => a.fullName === authorName);
    if (selectedAuthor) {
      this.authorData = selectedAuthor;
      this.showAuthorPopup = true;
    } else {
      console.warn(`Autore con nome ${authorName} non trovato.`);
    }
  }

  closeAuthorPopup() {
    this.showAuthorPopup = false;
  }

  addToCart() {
    if (!this.book) return;
    this.checkUserAddressExist().subscribe((hasAddress) => {
      if (hasAddress) {
        this._snackBar.open('Aggiungendo al carrello...', 'Chiudi', { duration: 3000 });
        try {
          const orderId = Number(localStorage.getItem('orderId')) || -1;
          if (orderId !== -1 && orderId !== undefined && orderId !== null) {

            let orderItem = {
              id: 0,
              orderId: orderId,
              inventoryId: this.book!.inventoryId,
              quantity: this.quantity,
            };
            console.log(orderItem);
            this.orderItem.insertOrderItem(orderItem).subscribe((res) => {
              if (res.rc) {
                console.log(res);
              }
            });
          } else {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${yyyy}-${mm}-${dd}`;
            let newOrder = {
              id: 0,
              status: 'PROCESSING',
              total: this.book!.price * this.quantity,
              orderNumber: Math.floor(Math.random() * 2147483645) + 1,
              shippingAddress: Number(localStorage.getItem('userAddressId')),
              updatedAt: formattedDate.toString(),
              user: this.auth.getUserId(),
            };
            console.log(newOrder);
            this.order.create(newOrder).subscribe((res) => {
              if (res.rc) {
                console.log(res);
                localStorage.setItem('orderId', res.dati.id);
                let orderItem = {
                  id: 0,
                  orderId: res.dati.id,
                  inventoryId: this.book!.inventoryId,
                  quantity: this.quantity,
                };
                this.orderItem.insertOrderItem(orderItem).subscribe((res) => {
                  console.log(res);
                });
              }
            });
          }
          this._snackBar.open(
            `Aggiunto ${this.quantity} x ${this.book!.title} al carrello!`,
            'Chiudi',
            {
              duration: 3000,
            }
          );
        } catch (error) {
          this._snackBar.open(`Errore durante l'aggiunta dell'articolo al carrello.`, 'Chiudi', {
            duration: 3000,
          });
        }
      } else {
        this._snackBar.open(
          'Aggiungi un indirizzo al tuo profilo (setting page) prima di aggiungere al carrello.',
          'Chiudi',
          {
            duration: 3000,
          }
        );
      }
    });
  }

  buyNow() {
    if (!this.book) return;
    this.checkUserAddressExist().subscribe((hasAddress) => {
      if (hasAddress) {
        this._snackBar.open(
          'Aggiungendo al carrello e reindirizzando alla pagina del carrello...',
          'Chiudi',
          { duration: 3000 }
        );
        try {
          const orderId = Number(localStorage.getItem('orderId')) || -1;
          if (orderId !== -1 && orderId !== undefined && orderId !== null) {
            let orderItem = {
              id: 0,
              orderId: orderId,
              inventoryId: this.book!.inventoryId,
              quantity: this.quantity,
            };
            this.orderItem.insertOrderItem(orderItem).subscribe((res) => {
              if (res.rc) {
                this._snackBar.open(
                  `Aggiunto ${this.quantity} x ${this.book!.title} al carrello!`,
                  'Chiudi',
                  { duration: 3000 }
                );
                this.router.navigate(['/cart']);
              }
            });
          } else {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${yyyy}-${mm}-${dd}`;
            let newOrder = {
              id: 0,
              status: 'PROCESSING',
              total: this.book!.price * this.quantity,
              orderNumber: Math.floor(Math.random() * 2147483645) + 1,
              shippingAddress: Number(localStorage.getItem('userAddressId')),
              updatedAt: formattedDate.toString(),
              user: this.auth.getUserId(),
            };
            this.order.create(newOrder).subscribe((res) => {
              if (res.rc) {
                localStorage.setItem('orderId', res.dati.id);
                let orderItem = {
                  id: 0,
                  orderId: res.dati.id,
                  inventoryId: this.book!.inventoryId,
                  quantity: this.quantity,
                };
                this.orderItem.insertOrderItem(orderItem).subscribe((res) => {
                  this._snackBar.open(
                    `Aggiunto ${this.quantity} x ${this.book!.title} al carrello!`,
                    'Chiudi',
                    { duration: 3000 }
                  );
                  this.router.navigate(['/cart']);
                });
              }
            });
          }
        } catch (error) {
          this._snackBar.open(`Errore durante l'aggiunta dell'articolo al carrello.`, 'Chiudi', {
            duration: 3000,
          });
        }
      } else {
        this._snackBar.open(
          'Aggiungi un indirizzo al tuo profilo (setting page) prima di aggiungere al carrello.',
          'Chiudi',
          { duration: 3000 }
        );
      }
    });
  }

  checkUserAddressExist(): Observable<boolean> {
    const userId = this.auth.getUserId();
    return this.userService.getById(userId).pipe(
      map((res) => {
        if (res.rc) {
          const user = res.dati;
          if (
            user.addresses[0] !== undefined &&
            user.addresses[0] !== null &&
            user.addresses[0] !== '' &&
            user.addresses[0] !== 0
          ) {
            localStorage.setItem('userAddressId', user.addresses[0]);
            return true;
          }
          return false;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }
}
