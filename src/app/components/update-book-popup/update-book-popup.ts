import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthorServiceService } from '../../services/author-service.service';
import { CategoryService } from '../../services/category-service';

@Component({
  selector: 'app-update-book-popup',
  standalone: false,
  templateUrl: './update-book-popup.html',
  styleUrls: ['./update-book-popup.css'], // <-- fix
})
export class UpdateBookPopup implements OnInit {
  updateBookForm: FormGroup;
  book: Partial<Book> = {};
  cat: Category[] = [];
  imageSrc: string | ArrayBuffer | null = null;

  constructor(
    private authorService: AuthorServiceService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { book: Partial<Book> } // ok se arrivi da MatDialog
  ) {
    this.book = data?.book ?? {};

    // ⬇️ category come FormControl<number[]> per mat-select multiple
    this.updateBookForm = this.fb.group({
      isbn: [this.book.isbn ?? '', [Validators.required, Validators.minLength(4)]],
      title: [this.book.title ?? '', [Validators.required, Validators.minLength(4)]],
      description: [this.book.description ?? '', [Validators.required, Validators.minLength(4)]],
      authors: [this.book.authors ?? [], [Validators.required]],         // number[]
      category: [this.book.category ?? [], [Validators.required]],        // number[]
      publisher: [this.book.publisher ?? '', [Validators.required, Validators.minLength(4)]],
      publicationDate: [this.book.publicationDate ?? '', [Validators.required]],
      pageCount: [this.book.pageCount ?? 0, [Validators.required, Validators.min(0)]],
      languageCode: [this.book.languageCode ?? '', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      edition: [this.book.edition ?? '', [Validators.required]],
      price: [this.book.price ?? 0, [Validators.required, Validators.min(0)]],
      stock: [this.book.stock ?? 0, [Validators.required, Validators.min(0)]],
      coverImage: [this.book.coverImage ?? '', [Validators.required, Validators.minLength(4)]],
    });
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe((res) => {
      this.cat = (res?.dati as Category[]) ?? [];

      // DEFAULT: se non hai category nel book, scegli alcune di default (es. prime 2)
      const current = this.updateBookForm.get('category')!.value as number[];
      if (!current || current.length === 0) {
        const defaultIds = this.cat.slice(0, 2).map(c => c.id); // <-- personalizza a piacere
        this.updateBookForm.patchValue({ category: defaultIds });
      }
    });
  }

  // Helper (se vuoi aggiornare anteprima)
  onCoverUrlInput(url: string) {
    this.imageSrc = url || null;
  }

  addNewBook() {
    if (this.updateBookForm.invalid) {
      alert('Please fill in all required fields correctly.');
      return;
    }
    console.log('Book added/updated:', this.updateBookForm.value);
    // reset (facoltativo)
  }

  onSubmit() {
    if (this.updateBookForm.invalid) return;
    alert('Form submitted');
    // this.dialogRef.close(this.updateBookForm.value) se usi MatDialogRef
  }
}

interface Category {
  id: number;
  name: string;
}

/** Allinea il modello con ciò che usi davvero nel form */
export interface Book {
  id: number;
  title: string;
  authors: number[];     // come nel tuo backend
  publisher: number | string; // se nel popup tieni il nome, metti string; se id, lascia number
  category: number[];    // ⬅️ id categorie selezionate
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
