import { AfterViewInit, Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BookService } from '../../services/book-service';
import { AuthorServiceService } from '../../services/author-service.service';
import { PublisherService } from '../../services/publisher-service';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UpdateBookPopup } from '../update-book-popup/update-book-popup';

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
  dataSource = new MatTableDataSource<Book>([]);

  public publisherNames: Record<number, string> = {};
  public bookAuthors: Record<number, { id: number; name: string }[]> = {};

  showAuthorPopup = false;
  showPublisherPopup = false;
  authorData: any = null;
  publisherData: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private bookService: BookService,
    private authorService: AuthorServiceService,
    private publisherService: PublisherService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.bookService.getBooksOrderedByName().subscribe((response) => {
      if (!response?.rc) {
        console.error(response?.msg ?? 'Errore nel recupero libri');
        return;
      }

      const books: Book[] = response.dati as Book[];
      this.dataSource.data = books;

      books.forEach((book) => {
        const calls = book.authors.map((id) => this.authorService.getById(id));
        forkJoin(calls).subscribe((resps) => {
          this.bookAuthors[book.id] = resps
            .map((r, idx) => {
              const id = book.authors[idx];
              const name = r?.dati?.fullName as string | undefined;
              return name ? { id, name } : undefined;
            })
            .filter(Boolean) as { id: number; name: string }[];
          this.cdr.markForCheck();
        });

        const pubId = book.publisher;
        if (this.publisherNames[pubId] == null) {
          this.publisherService.getById(pubId).subscribe((pubResp) => {
            const pubName: string | undefined =
              pubResp?.dati?.name ?? pubResp?.dati?.fullName ?? pubResp?.dati?.publisherName;
            this.publisherNames[pubId] = pubName ?? '—';
            this.cdr.markForCheck();
          });
        }
      });

      this.cdr.detectChanges();
    });
  }

  openAuthorPopup(authorId: number): void {
    this.authorService.getById(authorId).subscribe((resp) => {
      if (resp?.rc) {
        this.authorData = resp.dati;
        this.showAuthorPopup = true;
        this.cdr.markForCheck();
      }
    });
  }
  closeAuthorPopup(): void {
    this.showAuthorPopup = false;
    this.authorData = null;
  }

  openUpdateBookPopup(book: Book): void {
    this.dialog.open(UpdateBookPopup, {
      data: { book },
    });
  }

  closeUpdateBookPopup(): void {
    // No specific action needed on close for navigation-based popup
  }

  openPublisherPopup(publisherId: number): void {
    this.publisherService.getById(publisherId).subscribe((resp) => {
      if (resp?.rc) {
        this.publisherData = resp.dati;
        this.showPublisherPopup = true;
        this.cdr.markForCheck();
      }
    });
  }
  closePublisherPopup(): void {
    this.showPublisherPopup = false;
    this.publisherData = null;
  }

  showDeletePopup = false;
  bookToDelete: Book | null = null;

  confirmDelete(book: Book): void {
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

export interface Book {
  id: number;
  title: string;
  authors: number[];
  publisher: number;
  category?: any[];
  publicationDate: string;
  description: string;
  price: number;
  imageUrl?: string;
  stock?: number;
}
