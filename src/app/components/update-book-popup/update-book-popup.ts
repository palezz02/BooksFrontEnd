import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthorServiceService } from '../../services/author-service.service';

@Component({
  selector: 'app-update-book-popup',
  standalone: false,
  templateUrl: './update-book-popup.html',
  styleUrl: './update-book-popup.css',
})
export class UpdateBookPopup {
  updateBookForm;
  book: any;

  constructor(
    private authorService: AuthorServiceService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { book: any }
  ) {
    this.book = data.book;

    this.updateBookForm = this.formBuilder.group({
      isbn: [this.book?.isbn || '', [Validators.required, Validators.minLength(4)]],
      title: [this.book?.title || '', [Validators.required, Validators.minLength(4)]],
      description: [this.book?.description || '', [Validators.required, Validators.minLength(4)]],
      authors: [ this.book?.authors || [], [Validators.required]],
      category: [this.book?.category || [], [Validators.required]],
      publisher: [this.book?.publisher || '', [Validators.required, Validators.minLength(4)]],
      publicationDate: [this.book?.publicationDate || '', [Validators.required]],
      pageCount: [this.book?.pageCount || 0, [Validators.required, Validators.min(0)]],
      languageCode: [this.book?.languageCode || '', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      edition: [this.book?.edition || '', [Validators.required]],
      price: [this.book?.price || 0, [Validators.required, Validators.min(0)]],
      stock: [this.book?.stock || 0, [Validators.required, Validators.min(0)]],
      coverImage: [this.book?.coverImage || '', [Validators.required, Validators.minLength(4)]],
    });
  }


  imageSrc: string | ArrayBuffer | null = null;

  get category(): FormArray {
    return this.updateBookForm.get('category') as unknown as FormArray;
  }

  addCategory(value: string) {
    const trimmed = value.trim();
    if (trimmed) {
      this.category.push(this.formBuilder.control(trimmed));
    }
  }

  removeCategory(index: number) {
    this.category.removeAt(index);
  }

  addNewBook() {
    if (this.updateBookForm.invalid) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    console.log('Book added:', this.updateBookForm.value);

    this.updateBookForm.reset({
      title: '',
      authors: [],
      category: [],
      isbn: '',
      publicationDate: new Date().getFullYear().toString(),
      description: '',
      coverImage: '',
      stock: 0,
      pageCount: 0,
      price: 0,
      publisher: '',
      // inventory: { stock: 0, price: 0 },
      languageCode: '',
    });
    this.category.clear();
    this.imageSrc = null;
  }

  onSubmit() {
    alert('Form submitted');
  }
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
}
