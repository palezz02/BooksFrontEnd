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
  showNewCategoryInput = false;
  showNewAuthorInput = false;
  showNewLanguageCodeInput = false;
  categories: string[] = ['Fantasy', 'Science Fiction', 'Romance'];
  authors: string[] = ['Grazia Deledda', 'Elsa Morante', 'Anna Maria Ortese'];
  languageCodes: string[] = ['IT', 'FR', 'EN'];

  private formBuilder = inject(FormBuilder);
  // private authService = inject(AuthService);
  private router = inject(Router);
  // private platformId = inject(PLATFORM_ID);

  bookForm = this.formBuilder.group({
    title: ['', Validators.required],
    author: this.formBuilder.control<string[]>([]),
    newAuthor: [''],
    category: this.formBuilder.control<string[]>([]),
    newCategory: [''],
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
    languageCode: this.formBuilder.control<string[]>([], [Validators.pattern(/^[a-zA-Z]{2}$/)]),
    newLanguageCode: [''],
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


   openNewLanguageCodeInput(event: Event) {
    event.preventDefault();
    this.showNewLanguageCodeInput = true;
  }
  addLanguageCode() {
    const newLanguageCode = this.bookForm.get('newLanguageCode')?.value?.trim();

    if (newLanguageCode && !this.languageCodes.includes(newLanguageCode)) {
      this.languageCodes.push(newLanguageCode);

      const currentLanguageCodes = this.bookForm.get('languageCode')?.value ?? [];
      this.bookForm.get('languageCode')?.setValue([...currentLanguageCodes, newLanguageCode]);
    }

    this.bookForm.get('newLanguageCode')?.reset('');
    this.showNewLanguageCodeInput = false;
  }


  openNewAuthorInput(event: Event) {
    event.preventDefault();
    this.showNewAuthorInput = true;
  }
  addAuthor() {
    const newAuthor = this.bookForm.get('newAuthor')?.value?.trim();

    if (newAuthor && !this.authors.includes(newAuthor)) {
      this.authors.push(newAuthor);

      const currentAuthors = this.bookForm.get('author')?.value ?? [];
      this.bookForm.get('author')?.setValue([...currentAuthors, newAuthor]);
    }

    this.bookForm.get('newAuthor')?.reset('');
    this.showNewAuthorInput = false;
  }

  openNewCategoryInput(event: Event) {
    event.preventDefault();
    this.showNewCategoryInput = true;
  }
  addCategory() {
    const newCategory = this.bookForm.get('newCategory')?.value?.trim();

    if (newCategory && !this.categories.includes(newCategory)) {
      this.categories.push(newCategory);

      const currentCategories = this.bookForm.get('category')?.value ?? [];
      this.bookForm.get('category')?.setValue([...currentCategories, newCategory]);
    }

    this.bookForm.get('newCategory')?.reset('');
    this.showNewCategoryInput = false;
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
      author: [],
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
      languageCode: [],
    });
    this.category.clear();
    this.imageSrc = null;
  }

  onSubmit() {
    console.log('Submitted book:', this.bookForm.value);
  }
}
