import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/authService';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-new-book',
  templateUrl: './new-book.html',
  styleUrls: ['./new-book.css'],
  standalone: false,
})
// implements OnInit
export class NewBook {
  private formBuilder = inject(FormBuilder);
  // private authService = inject(AuthService);
  private router = inject(Router);
  // private platformId = inject(PLATFORM_ID);

  bookForm = this.formBuilder.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    category: this.formBuilder.array<string>([]),
    isbn: [
      '',
      [
        Validators.required,
        Validators.minLength(13),
        Validators.maxLength(13),
        Validators.pattern(/^\d{13}$/),
      ],
    ],
    publisher: ['', Validators.required],
    year: [new Date().getFullYear(), [Validators.required, Validators.max(2025)]],
    description: ['', Validators.maxLength(5000)],
    imageUrl: ['', Validators.maxLength(2048)],
    stock: [0, [Validators.required, Validators.min(0)]],
    pages: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    languageCode: [
      '',
      [
        Validators.pattern(/^[a-zA-Z]{2}$/), // exactly two letters
      ],
    ],
    edition: ['', Validators.maxLength(100)],
  });

  imageSrc: string | ArrayBuffer | null = null;

  get category(): FormArray {
    return this.bookForm.get('category') as FormArray;
  }

  // ngOnInit() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     if (!this.authService.isAutentificated() || !this.authService.isRoleAdmin()) {
  //       alert('Access denied. Admins only.');
  //       this.router.navigate(['/']); // Redirect to home page
  //     }
  //   }
  // }

  addCategory(value: string) {
    const trimmed = value.trim();
    if (trimmed) {
      this.category.push(this.formBuilder.control(trimmed));
    }
  }

  removeCategory(index: number) {
    this.category.removeAt(index);
  }

  incrementStock() {
    const control = this.bookForm.get('stock');
    let value = control?.value ?? 0;
    control?.setValue(value + 1);
  }

  decrementStock() {
    const control = this.bookForm.get('stock');
    let value = control?.value ?? 0;
    if (value > 0) {
      control?.setValue(value - 1);
    }
  }
  incrementPages() {
    const control = this.bookForm.get('pages');
    let value = control?.value ?? 0;
    control?.setValue(value + 1);
  }

  decrementPages() {
    const control = this.bookForm.get('pages');
    let value = control?.value ?? 0;
    if (value > 0) {
      control?.setValue(value - 1);
    }
  }

  addNewBook() {
    if (this.bookForm.invalid) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    console.log('Book added:', this.bookForm.value);

    this.bookForm.reset({
      title: '',
      author: '',
      category: [],
      isbn: '',
      year: new Date().getFullYear(),
      description: '',
      imageUrl: '',
      stock: 0,
      pages: 0,
      price: 0,
      publisher: '',
      // inventory: { stock: 0, price: 0 },
      languageCode: '',
    });
    this.category.clear();
    this.imageSrc = null;
  }

  onSubmit() {
    console.log('Submitted book:', this.bookForm.value);
  }
}
