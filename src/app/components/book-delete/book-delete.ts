import { AfterViewInit, Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BookService } from '../../services/book-service';
import { AuthorServiceService } from '../../services/author-service.service';
import { PublisherService } from '../../services/publisher-service';
import { forkJoin } from 'rxjs';

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

  /** mappe di supporto */
  public bookAuthors: Record<number, string[]> = {};
  public publisherNames: Record<number, string> = {};
  public bookYear: Record<number, string> = {}; // <-- anno pre-calcolato

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private bookService: BookService,
    private authorService: AuthorServiceService,
    private publisherService: PublisherService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.bookService.getAll().subscribe((response) => {
      if (!response?.rc) {
        console.error(response?.msg ?? 'Errore nel recupero libri');
        return;
      }

      const books: Book[] = response.dati as Book[];
      this.dataSource.data = books;

      books.forEach((book) => {
        this.bookYear[book.id] = book.publicationDate;
        console.log('Dati libro', response.dati[0]);

        const authorCalls = book.authors.map((id) => this.authorService.getById(id));

        forkJoin(authorCalls).subscribe((authorResps) => {
          const names = authorResps.map((r) => r?.dati?.fullName as string).filter((n) => !!n);
          this.bookAuthors[book.id] = names.length > 0 ? names : ['N/A'];
          this.cdr.markForCheck();
        });

        const pubId = book.publisher;
        if (this.publisherNames[pubId] == null) {
          this.publisherService.getById(pubId).subscribe((pubResp) => {
            const pubName: string | undefined =
              pubResp?.dati?.name ?? pubResp?.dati?.fullName ?? pubResp?.dati?.publisherName;
            this.publisherNames[pubId] = pubName ?? 'N/A';
            this.cdr.markForCheck();
          });
        }
      });

      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}

/* Modelli */
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
