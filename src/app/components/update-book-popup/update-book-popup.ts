import { Component, Inject, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthorServiceService } from '../../services/author-service.service';
import { CategoryService } from '../../services/category-service';
import { PublisherService } from '../../services/publisher-service';

@Component({
  selector: 'app-update-book-popup',
  standalone: false,
  templateUrl: './update-book-popup.html',
  styleUrls: ['./update-book-popup.css'],
})
export class UpdateBookPopup implements OnInit, AfterViewInit {
  updateBookForm: FormGroup;
  book: Partial<Book> = {};

  cat: Category[] = [];
  authorsList: Author[] = [];
  publishersList: Publisher[] = [];

  imageSrc: string | ArrayBuffer | null = null;

  constructor(
    private authorService: AuthorServiceService,
    private categoryService: CategoryService,
    private publisherService: PublisherService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { book: Partial<Book> }
  ) {
    this.book = data?.book ?? {};

    console.log('Editing book', this.book);

    const initialAuthors = Array.isArray(this.book.authors)
      ? this.book.authors.map((x: any) => Number(x)).filter((n) => !Number.isNaN(n))
      : [];
    const rawCats = (this.book as any)?.category ?? (this.book as any)?.categories ?? [];

    const initialCats: number[] = Array.isArray(rawCats)
      ? rawCats
          .map((x: any) => Number(typeof x === 'object' && x !== null ? x.id : x))
          .filter((n) => Number.isFinite(n))
      : [];

    this.updateBookForm = this.fb.group({
      isbn: [this.book['isbn'] ?? '', [Validators.required, Validators.minLength(4)]],
      title: [this.book.title ?? '', [Validators.required, Validators.minLength(4)]],
      description: [this.book.description ?? '', [Validators.required, Validators.minLength(4)]],
      authorIds: [initialAuthors, [Validators.required]],
      categoryIds: [initialCats, [Validators.required]],
      publisherId: [
        typeof this.book['publisher'] === 'number' ? this.book['publisher'] : null,
        [Validators.required],
      ],
      publicationDate: [this.book.publicationDate ?? '', [Validators.required]],
      pageCount: [this.book['pageCount'] ?? 0, [Validators.required, Validators.min(0)]],
      languageCode: [
        this.book['languageCode'] ?? '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      ],
      edition: [this.book['edition'] ?? '', [Validators.required]],
      price: [this.book.price ?? 0, [Validators.required, Validators.min(0)]],
      stock: [this.book.stock ?? 0, [Validators.required, Validators.min(0)]],
      coverImage: [this.book['coverImage'] ?? '', [Validators.required, Validators.minLength(4)]],
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.categoryService.getAll().subscribe((res) => {
      this.cat = (res?.dati as Category[]) ?? [];
      this.cdr.detectChanges();
    });

    this.authorService.listAuthor?.().subscribe?.((res: any) => {
      this.authorsList = (res?.dati as Author[]) ?? [];
      this.cdr.detectChanges();
    });

    this.publisherService.listPublishers?.().subscribe?.((res: any) => {
      this.publishersList = (res?.dati as Publisher[]) ?? [];
      this.cdr.detectChanges();
    });
  }

  onCoverUrlInput(url: string) {
    this.imageSrc = url || null;
  }

  cancel() {
    // this.dialogRef.close(null);
  }

  onSubmit() {
    if (this.updateBookForm.invalid) return;

    const payload = {
      ...this.updateBookForm.value,
      authors: this.updateBookForm.value.authorIds as number[],
      category: this.updateBookForm.value.categoryIds as number[],
      publisher: Number(this.updateBookForm.value.publisherId),
    };

    console.log('Submit payload', payload);
    // this.dialogRef.close(payload);
  }
}

interface Category {
  id: number;
  name: string;
}
interface Author {
  id: number;
  fullName: string;
}
interface Publisher {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  authors: number[];
  publisher: number;
  category: number[];
  publicationDate: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  isbn: string;
  pageCount: number;
  languageCode: string;
  edition: string;
  coverImage: string;
}
