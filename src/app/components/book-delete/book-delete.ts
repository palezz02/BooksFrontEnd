import {
  AfterViewInit,
  Component,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BookService } from '../../services/book-service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateBookPopup } from '../update-book-popup/update-book-popup';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-book-delete',
  standalone: false,
  templateUrl: './book-delete.html',
  styleUrls: ['./book-delete.css'],
})
export class BookDelete implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'title',
    'author',
    'publisher',
    'year',
    'price',
    'stock',
    'actions',
  ];
  dataSource = new MatTableDataSource<BookDTO>([]);

  public bookAuthors: Record<number, { id: number; name: string }[]> = {};
  public publisherNames: Record<number, string> = {};

  showAuthorPopup = false;
  showPublisherPopup = false;
  authorData: any = null;
  publisherData: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private bookService: BookService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.bookService.getAll().subscribe((response) => {
      if (!response?.rc) {
        console.error(response?.msg ?? 'Errore nel recupero libri');
        return;
      }

      const books: BookDTO[] = (
        Array.isArray(response.dati) ? response.dati : [response.dati]
      ).sort((a, b) => a.title.localeCompare(b.title));

      this.dataSource.data = books;

      books.forEach((book) => {
        this.bookAuthors[book.id] = (book.authors || []).map((a) => ({
          id: a.id,
          name: a.fullName,
        }));

        this.publisherNames[book.publisherId] = book.publisherName || '—';
      });

      this.cdr.detectChanges();
    });
  }

  openAuthorPopup(authorId: number): void {
    // Trova l'autore nei dati già disponibili
    for (const book of this.dataSource.data) {
      const author = (book.authors || []).find((a) => a.id === authorId);
      if (author) {
        this.authorData = author;
        this.showAuthorPopup = true;
        this.cdr.markForCheck();
        return;
      }
    }
  }
  closeAuthorPopup(): void {
    this.showAuthorPopup = false;
    this.authorData = null;
  }

  openUpdateBookPopup(book: BookDTO): void {
    this.dialog.open(UpdateBookPopup, {
      data: { book },
    });
  }

  closeUpdateBookPopup(): void {
    // No specific action needed on close for navigation-based popup
  }

  openPublisherPopup(publisherId: number): void {
    // Trova l'editore nei dati già disponibili
    for (const book of this.dataSource.data) {
      if (book.publisherId === publisherId) {
        this.publisherData = {
          id: book.publisherId,
          name: book.publisherName,
          description: book.publisherDescription,
        };
        this.showPublisherPopup = true;
        this.cdr.markForCheck();
        return;
      }
    }
  }
  closePublisherPopup(): void {
    this.showPublisherPopup = false;
    this.publisherData = null;
  }

  showDeletePopup = false;
  bookToDelete: BookDTO | null = null;

  confirmDelete(book: BookDTO): void {
    this.bookToDelete = book;
    this.showDeletePopup = true;
  }

  cancelDelete(): void {
    this.bookToDelete = null;
    this.showDeletePopup = false;
  }

  deleteBook(): void {
    if (!this.bookToDelete) return;

    const id = this.bookToDelete.id;

    this.bookService.delete({ id }).subscribe({
      next: (resp) => {
        if (resp.rc) {
          this.dataSource.data = this.dataSource.data.filter((b) => b.id !== id);

          alert(`Libro "${this.bookToDelete?.title}" cancellato con successo`);
        } else {
          console.error(resp.msg);
          alert("Errore durante l'eliminazione: " + (resp.msg || 'sconosciuto'));
        }
        this.cancelDelete();
      },
      error: (err) => {
        console.error('Errore eliminazione', err);
        alert("Errore di comunicazione con il server durante l'eliminazione");
        this.cancelDelete();
      },
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}

// Nuova interfaccia BookDTO secondo il nuovo backend
export interface BookDTO {
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
  publisherId: number;
  publisherName: string;
  publisherDescription: string;
  authors: {
    id: number;
    fullName: string;
    biography: string;
    birthDate: string;
    deathDate: string;
    coverImageUrl: string;
    books: number[];
  }[];
  categories: { id: number; name: string }[];
  reviews: number[];
  averageRating: number;
  inventoryId: number;
}
