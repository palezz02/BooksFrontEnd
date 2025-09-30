import { Component, Inject, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthorServiceService } from '../../services/author-service.service';
import { CategoryService } from '../../services/category-service';
import { PublisherService } from '../../services/publisher-service';
import { BookService } from '../../services/book-service';

@Component({
  selector: 'app-update-book-popup',
  standalone: false,
  templateUrl: './update-book-popup.html',
  styleUrls: ['./update-book-popup.css'],
})
export class UpdateBookPopup implements OnInit, AfterViewInit {
  updateBookForm!: FormGroup;

  authorsList: Author[] = [];
  cat: Category[] = [];
  publishersList: Publisher[] = [];
  imageSrc: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private authorService: AuthorServiceService,
    private categoryService: CategoryService,
    private publisherService: PublisherService,
    private bookService: BookService,
    private dialogRef: MatDialogRef<UpdateBookPopup>,
    @Inject(MAT_DIALOG_DATA) public data: { book: Partial<BookIncoming> }
  ) {
    const book = data?.book ?? {};
    const n = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : null);
    const toIds = (arr: any) =>
      Array.isArray(arr)
        ? (Array.from(
            new Set(
              arr
                .map((x: any) => (typeof x === 'object' && x ? n(x.id) : n(x)))
                .filter(Number.isFinite)
            )
          ) as number[])
        : [];

    const initialAuthorIds = toIds((book as any).authorIds ?? (book as any).authors);
    const initialCategoryIds = toIds(
      (book as any).categoryIds ?? (book as any).categories ?? (book as any).category
    );
    const initialPublisherId = n(
      (book as any).publisherId ?? (book as any).publisher ?? (book as any).pusblisherId
    );

    this.updateBookForm = this.fb.group({
      id: [n(book.id)],
      isbn: [book.isbn ?? ''],
      title: [book.title ?? ''],
      pageCount: [n((book as any).pageCount) ?? null],
      description: [book.description ?? ''],
      coverImage: [(book as any).coverImage ?? (book as any).imageUrl ?? ''],
      languageCode: [book.languageCode ?? ''],
      edition: [book.edition ?? ''],
      publisherId: [initialPublisherId],
      stock: [n((book as any).stock) ?? null],
      price: [Number((book as any).price ?? null)],
      authorIds: [initialAuthorIds],
      categoryIds: [initialCategoryIds],
      publicationDate: [book.publicationDate ?? ''],
    });

    this.imageSrc = (this.updateBookForm.get('coverImage')?.value as string) || null;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.authorService.listAuthor?.().subscribe?.((res: any) => {
      this.authorsList = ((res?.dati as Author[]) ?? []).map((a) => ({ ...a, id: Number(a.id) }));
      this.cdr.detectChanges();
    });

    this.categoryService.getAll().subscribe((res) => {
      this.cat = ((res?.dati as Category[]) ?? []).map((c) => ({ ...c, id: Number(c.id) }));
      this.cdr.detectChanges();
    });

    this.publisherService.listPublishers?.().subscribe?.((res: any) => {
      this.publishersList = ((res?.dati as Publisher[]) ?? []).map((p) => ({
        ...p,
        id: Number(p.id),
      }));

      const ctrl = this.updateBookForm.get('publisherId');
      const want = Number(
        ctrl?.value ?? (this.data?.book as any)?.publisherId ?? (this.data?.book as any)?.publisher
      );
      if (Number.isFinite(want) && this.publishersList.some((p) => p.id === want)) {
        Promise.resolve().then(() => ctrl?.setValue(want, { emitEvent: false }));
      }
      this.cdr.detectChanges();
    });
  }

  onCoverUrlInput(url: string) {
    this.imageSrc = url || null;
  }

  cancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    // Corpo ESATTO richiesto da Swagger
    const dto: BookDto = {
      id: Number(this.updateBookForm.get('id')?.value) || 0,
      isbn: this.updateBookForm.get('isbn')?.value || '',
      title: this.updateBookForm.get('title')?.value || '',
      pageCount: Number(this.updateBookForm.get('pageCount')?.value) || 0,
      description: this.updateBookForm.get('description')?.value || '',
      coverImage: this.updateBookForm.get('coverImage')?.value || '',
      languageCode: this.updateBookForm.get('languageCode')?.value || '',
      edition: this.updateBookForm.get('edition')?.value || '',
      publisherId: Number(this.updateBookForm.get('publisherId')?.value) || 0,
      stock: Number(this.updateBookForm.get('stock')?.value) || 0,
      price: Number(this.updateBookForm.get('price')?.value) || 0,
      authorIds: (this.updateBookForm.get('authorIds')?.value as number[]) || [],
      categoryIds: (this.updateBookForm.get('categoryIds')?.value as number[]) || [],
      publicationDate: this.updateBookForm.get('publicationDate')?.value || '',
    };

    this.bookService.update(dto).subscribe({
      next: (resp: any) => {
        if (resp?.rc) {
          this.dialogRef.close(true);
        } // <- chiude
        else {
          alert("Errore durante l'aggiornamento: " + (resp?.msg ?? 'sconosciuto'));
        }
      },
      error: (err) => {
        console.error(err);
        alert("Errore durante l'aggiornamento");
      },
    });
  }
}

/*** MODELS ***/
interface Author {
  id: number;
  fullName: string;
}
interface Category {
  id: number;
  name: string;
}
interface Publisher {
  id: number;
  name: string;
}

interface BookIncoming {
  id?: number;
  isbn?: string;
  title?: string;
  pageCount?: number;
  description?: string;
  coverImage?: string;
  imageUrl?: string;
  languageCode?: string;
  edition?: string;
  publisher?: number | { id: number; name: string };
  publisherId?: number;
  pusblisherId?: number;
  stock?: number;
  price?: number;
  authorIds?: number[];
  authors?: any[];
  categoryIds?: number[];
  categories?: any[];
  category?: any[];
  publicationDate?: string;
}

interface BookDto {
  id: number;
  isbn: string;
  title: string;
  pageCount: number;
  description: string;
  coverImage: string;
  languageCode: string;
  edition: string;
  publisherId: number;
  stock: number;
  price: number;
  authorIds: number[];
  categoryIds: number[];
  publicationDate: string;
}
