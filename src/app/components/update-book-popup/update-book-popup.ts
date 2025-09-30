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

  /** snapshot iniziale normalizzato per confronto */
  private originalDto!: BookDto;

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

    const initialAuthorIds   = toIds((book as any).authorIds ?? (book as any).authors);
    const initialCategoryIds = toIds((book as any).categoryIds ?? (book as any).categories ?? (book as any).category);
    const initialPublisherId = n((book as any).publisherId ?? (book as any).publisher ?? (book as any).pusblisherId);

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

    this.originalDto = this.mapFormToDto(this.updateBookForm.getRawValue());
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.authorService.listAuthor?.().subscribe?.((res: any) => {
      this.authorsList = ((res?.dati as Author[]) ?? []).map(a => ({ ...a, id: Number(a.id) }));
      this.cdr.detectChanges();
    });

    this.categoryService.getAll().subscribe(res => {
      this.cat = ((res?.dati as Category[]) ?? []).map(c => ({ ...c, id: Number(c.id) }));
      this.cdr.detectChanges();
    });

    this.publisherService.listPublishers?.().subscribe?.((res: any) => {
      this.publishersList = ((res?.dati as Publisher[]) ?? []).map(p => ({ ...p, id: Number(p.id) }));
      const ctrl = this.updateBookForm.get('publisherId');
      const want = Number(
        ctrl?.value ?? (this.data?.book as any)?.publisherId ?? (this.data?.book as any)?.publisher
      );
      if (Number.isFinite(want) && this.publishersList.some(p => p.id === want)) {
        Promise.resolve().then(() => ctrl?.setValue(want, { emitEvent: false }));
      }
      this.cdr.detectChanges();
    });
  }

  onCoverUrlInput(url: string) { this.imageSrc = url || null; }
  cancel() { this.dialogRef.close(false); }

  /** Mappa i valori del form nel DTO Swagger (tipi coerenti) */
  private mapFormToDto(raw: any): BookDto {
    const toNum = (v:any) => Number.isFinite(Number(v)) ? Number(v) : 0;
    const toIds = (v:any): number[] =>
      Array.isArray(v)
        ? Array.from(new Set(v.map((x:any)=>toNum(x)).filter((x:number)=>Number.isFinite(x)))).sort((a,b)=>a-b)
        : [];

    const str = (v:any) => (v ?? '').toString();

    return {
      id: toNum(raw.id),
      isbn: str(raw.isbn),
      title: str(raw.title),
      pageCount: toNum(raw.pageCount),
      description: str(raw.description),
      coverImage: str(raw.coverImage),
      languageCode: str(raw.languageCode),
      edition: str(raw.edition),
      publisherId: toNum(raw.publisherId),
      stock: toNum(raw.stock),
      price: Number(raw.price ?? 0),
      authorIds: toIds(raw.authorIds),
      categoryIds: toIds(raw.categoryIds),
      publicationDate: str(raw.publicationDate),
    };
  }

  /** Confronto robusto (stringhe, numeri, array ordinati) */
  private isEqual(a: any, b: any): boolean {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
      return true;
    }
    return a === b;
  }

  /** Costruisce PATCH con null per invariati (id sempre presente) */
  private buildNullPatch(prev: BookDto, curr: BookDto): Partial<BookDto> & { id: number } {
    const patch: any = { id: prev.id };
    (Object.keys(curr) as (keyof BookDto)[])
      .filter(k => k !== 'id')
      .forEach(k => {
        patch[k] = this.isEqual(prev[k], curr[k]) ? null : curr[k];
      });
    return patch;
  }

  onSubmit() {
    const currentDto = this.mapFormToDto(this.updateBookForm.getRawValue());
    const patch = this.buildNullPatch(this.originalDto, currentDto);

    const hasChanges = Object.keys(patch).some(k => k !== 'id' && (patch as any)[k] !== null);
    if (!hasChanges) {
      console.log("Nessuna modifica da salvare");
      this.dialogRef.close(false);
      return;
    }
    console.log("Patch da inviare:", patch);
    this.bookService.update(patch).subscribe({
  next: (resp) => {
    if (resp?.rc) {
      alert('Libro aggiornato con successo');
    } else {
      alert('Errore durante l\'aggiornamento: ' + (resp?.msg || 'sconosciuto'));
    }
  },
  error: (err) => {
    console.error('Update errore:', err);
    alert('Errore durante l\'aggiornamento');
  }
});
  }
}

/*** MODELS ***/
interface Author { id: number; fullName: string; }
interface Category { id: number; name: string; }
interface Publisher { id: number; name: string; }

interface BookIncoming {
  id?: number; isbn?: string; title?: string; pageCount?: number; description?: string;
  coverImage?: string; imageUrl?: string; languageCode?: string; edition?: string;
  publisher?: number | { id: number; name: string }; publisherId?: number; pusblisherId?: number;
  stock?: number; price?: number; authorIds?: number[]; authors?: any[];
  categoryIds?: number[]; categories?: any[]; category?: any[]; publicationDate?: string;
}

/** DTO Swagger (usato per confronto e patch) */
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
