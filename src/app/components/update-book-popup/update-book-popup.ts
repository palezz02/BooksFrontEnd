import { Component } from '@angular/core';

import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-book-popup',
  standalone: false,
  templateUrl: './update-book-popup.html',
  styleUrl: './update-book-popup.css',
})
export class UpdateBookPopup {
  private formBuilder = new FormBuilder();

  updateBookForm = this.formBuilder.group({
    isbn: ['4231423142314231', [Validators.required, Validators.minLength(4)]],
    title: ['', [Validators.required, Validators.minLength(4)]],
    description: ['', [Validators.required, Validators.minLength(4)]],
    authors: [ [
      0
    ], [Validators.required]],
    category: [ [
      0
    ], [Validators.required]],
    publisher: ['', [Validators.required, Validators.minLength(4)]],
    publicationDate: ['', [Validators.required]],
    pageCount: [0, [Validators.required, Validators.min(0)]],
    languageCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
    edition: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    coverImage: ['', [Validators.required, Validators.minLength(4)]],
  });

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
