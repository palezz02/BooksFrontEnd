import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../../services/book-service';
import { AuthorServiceService } from '../../services/author-service.service';
import { PublisherService } from '../../services/publisher-service';
import { CategoryService } from '../../services/category-service';
import { ResponseList } from '../../models/ResponseList';

@Component({
  selector: 'app-new-book',
  templateUrl: './new-book.html',
  styleUrls: ['./new-book.css'],
  standalone: false,
})
export class NewBook implements OnInit {
  showNewPublisherInput = false;
  showNewCategoryInput = false;
  showNewAuthorInput = false;

  bookForm: FormGroup;
  imageSrc: string | null = null;
  authors: any[] = [];
  publishers: any[] = [];
  categories: any[] = [];
  currentYear: number = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private authorService: AuthorServiceService,
    private publisherService: PublisherService,
    private categoryService: CategoryService
  ) {
    this.bookForm = this.fb.group({
      isbn: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      title: ['', Validators.required],
      pageCount: [0, [Validators.required, Validators.min(1)]],
      description: [''],
      coverImage: [''],
      languageCode: ['', [Validators.required, Validators.maxLength(2)]],
      publicationDate: ['', Validators.required],
      edition: ['', Validators.required],
      publisherId: [null, Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      authorIds: [[], Validators.required],
      categoryIds: [[], Validators.required],
  
      newAuthor: [''],
      newCategory: [''],
      newPublisher: [''],
      selectedAuthors: [[]],
      selectedCategories: [[]],
      selectedPublisher: [null],
    });
  }

  ngOnInit(): void {
    this.bookForm.get('coverImage')?.valueChanges.subscribe((value) => {
      this.imageSrc = value;
    });

    this.loadAuthors();
    this.loadPublishers();
    this.loadCategories();
  }

  loadAuthors(): void {
    this.authorService.listAuthor().subscribe({
      next: (res: ResponseList<any>) => {
        if (res.rc && res.dati) {
          this.authors = res.dati;
        }
      },
      error: (err) => console.error('Error loading authors:', err),
    });
  }

  loadPublishers(): void {
    this.publisherService.listPublishers().subscribe({
      next: (res: ResponseList<any>) => {
        if (res.rc && res.dati) {
          this.publishers = res.dati;
        }
      },
      error: (err) => console.error('Error loading publishers:', err),
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (res: ResponseList<any>) => {
        if (res.rc && res.dati) {
          this.categories = res.dati;
        }
      },
      error: (err) => console.error('Error loading categories:', err),
    });
  }


  onAuthorSelectionChange(selectedAuthors: any[]): void {
    const authorIds = selectedAuthors.map((author) => author.id);
    this.bookForm.get('authorIds')?.setValue(authorIds);
  }


  onCategorySelectionChange(selectedCategories: any[]): void {
    const categoryIds = selectedCategories.map((category) => category.id);
    this.bookForm.get('categoryIds')?.setValue(categoryIds);
  }


  onPublisherSelectionChange(selectedPublisher: any): void {
    this.bookForm.get('publisherId')?.setValue(selectedPublisher?.id || null);
  }

  openNewAuthorInput(event: Event): void {
    event.preventDefault();
    this.showNewAuthorInput = true;
  }

  addAuthor(): void {
    const newAuthorName = this.bookForm.get('newAuthor')?.value?.trim();

    if (newAuthorName) {
      const authorReq = {
        fullName: newAuthorName,
        biography: '',
        birthDate: null,
        deathDate: null,
        coverImageUrl: '',
      };

      this.authorService.insertAuthor(authorReq).subscribe({
        next: (response) => {
          if (response.rc) {
            this.loadAuthors();
            this.bookForm.get('newAuthor')?.reset('');
            this.showNewAuthorInput = false;
          } else {
            alert('Error creating author: ' + response.msg);
          }
        },
        error: (err) => {
          alert('Error creating author');
        },
      });
    }
  }
  deleteAuthor(event: Event, author: any): void {
    event.stopPropagation();

    if (confirm(`Are you sure you want to delete "${author.fullName}"?`)) {
      this.authorService.removeAuthor({ id: author.id }).subscribe({
        next: (response) => {
          if (response.rc) {
            alert('Author deleted successfully');

            const selectedAuthors = this.bookForm.get('selectedAuthors')?.value || [];
            const updatedAuthors = selectedAuthors.filter((a: any) => a.id !== author.id);
            this.bookForm.get('selectedAuthors')?.setValue(updatedAuthors);

            const authorIds = updatedAuthors.map((a: any) => a.id);
            this.bookForm.get('authorIds')?.setValue(authorIds);

            this.loadAuthors();
          } else {
            alert('Error deleting author: ' + response.msg);
          }
        },
        error: (err) => {
          console.error('Error deleting author:', err);
          alert(err.error?.msg || 'Error deleting author');
        },
      });
    }
  }
  openNewCategoryInput(event: Event): void {
    event.preventDefault();
    this.showNewCategoryInput = true;
  }

  addCategory(): void {
    const newCategoryName = this.bookForm.get('newCategory')?.value?.trim();

    if (newCategoryName) {
      const categoryReq = {
        name: newCategoryName,
      };

      this.categoryService.create(categoryReq).subscribe({
        next: (response) => {
          if (response.rc) {
            this.loadCategories();
            this.bookForm.get('newCategory')?.reset('');
            this.showNewCategoryInput = false;
          } else {
            alert('Error creating category: ' + response.msg);
          }
        },
        error: (err) => {
          alert('Error creating category');
        },
      });
    }
  }
  deleteCategory(event: Event, category: any): void {
    event.stopPropagation();

    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      this.categoryService.delete({ id: category.id }).subscribe({
        next: (response) => {
          if (response.rc) {
            alert('Category deleted successfully');

            const selectedCategories = this.bookForm.get('selectedCategories')?.value || [];
            const updatedCategories = selectedCategories.filter((c: any) => c.id !== category.id);
            this.bookForm.get('selectedCategories')?.setValue(updatedCategories);

            const categoryIds = updatedCategories.map((c: any) => c.id);
            this.bookForm.get('categoryIds')?.setValue(categoryIds);

            this.loadCategories();
          } else {
            alert('Error deleting category: ' + response.msg);
          }
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          alert(err.error?.msg || 'Error deleting category');
        },
      });
    }
  }

  openNewPublisherInput(event: Event): void {
    event.preventDefault();
    this.showNewPublisherInput = true;
  }

  addPublisher(): void {
    const newPublisherName = this.bookForm.get('newPublisher')?.value?.trim();

    if (newPublisherName) {
      const publisherReq = {
        name: newPublisherName,
        description: '',
      };

      this.publisherService.insertPublisher(publisherReq).subscribe({
        next: (response) => {
          if (response.rc) {
            this.loadPublishers();
            this.bookForm.get('newPublisher')?.reset('');
            this.showNewPublisherInput = false;
          } else {
            alert('Error creating publisher: ' + response.msg);
          }
        },
        error: (err) => {
          alert('Error creating publisher');
        },
      });
    }
  }
  deletePublisher(event: Event, publisher: any): void {
    event.stopPropagation();

    if (confirm(`Are you sure you want to delete "${publisher.name}"?`)) {
      this.publisherService.removePublisher({ id: publisher.id }).subscribe({
        next: (response) => {
          if (response.rc) {
            alert('Publisher deleted successfully');

            const selectedPublishers = this.bookForm.get('selectedPublishers')?.value || [];
            const updatedPublishers = selectedPublishers.filter((p: any) => p.id !== publisher.id);
            this.bookForm.get('selectedPublishers')?.setValue(updatedPublishers);

            const publisherId = updatedPublishers.map((p: any) => p.id);
            this.bookForm.get('publisherId')?.setValue(publisherId);

            this.loadPublishers();
          } else {
            alert('Error deleting publisher: ' + response.msg);
          }
        },
        error: (err) => {
          console.error('Error deleting publisher:', err);
          alert(err.error?.msg || 'Error deleting publisher');
        },
      });
    }
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      const invalidFields = Object.keys(this.bookForm.controls)
        .filter((key) => this.bookForm.get(key)?.invalid)
        .map((key) => key);

      alert('Please fill all required fields: ' + invalidFields.join(', '));
      this.markFormGroupTouched();
      return;
    }


    const coverImageInput = document.getElementById('cover') as HTMLInputElement;
    const coverImageUrl = coverImageInput?.value || '';


    const publicationDate = this.bookForm.value.publicationDate;
    let formattedDate = null;
    if (publicationDate) {
      if (typeof publicationDate === 'string' && publicationDate.length === 4) {
        formattedDate = `${publicationDate}-01-01`;
      } else {
        formattedDate = publicationDate;
      }
    }

    const bookReq = {
      isbn: this.bookForm.value.isbn,
      title: this.bookForm.value.title,
      pageCount: this.bookForm.value.pageCount,
      description: this.bookForm.value.description || '',
      coverImage: coverImageUrl,
      languageCode: this.bookForm.value.languageCode,
      publicationDate: formattedDate,
      edition: this.bookForm.value.edition,
      publisherId: this.bookForm.value.publisherId,
      stock: this.bookForm.value.stock,
      price: this.bookForm.value.price,
      authorIds: this.bookForm.value.authorIds,
      categoryIds: this.bookForm.value.categoryIds,
    };


    this.bookService.create(bookReq).subscribe({
      next: (response) => {
        if (response.rc) {
          alert('Book created successfully!');
          this.bookForm.reset();
          this.resetFormState();
        } else {
          alert('Error creating book: ' + response.msg);
        }
      },
      error: (err) => {
        let errorMessage = 'Error creating book.';
        if (err.error && err.error.msg) {
          errorMessage = 'Error: ' + err.error.msg;
        }
        alert(errorMessage);
      },
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.bookForm.controls).forEach((key) => {
      const control = this.bookForm.get(key);
      control?.markAsTouched();
    });
  }

  private resetFormState(): void {
    this.imageSrc = null;
    const coverImageInput = document.getElementById('cover') as HTMLInputElement;
    if (coverImageInput) {
      coverImageInput.value = '';
    }
  }

  incrementStock(): void {
    const control = this.bookForm.get('stock');
    const value = control?.value ?? 0;
    control?.setValue(value + 1);
  }

  decrementStock(): void {
    const control = this.bookForm.get('stock');
    const value = control?.value ?? 0;
    if (value > 0) {
      control?.setValue(value - 1);
    }
  }

  incrementPages(): void {
    const control = this.bookForm.get('pageCount');
    const value = control?.value ?? 0;
    control?.setValue(value + 1);
  }

  decrementPages(): void {
    const control = this.bookForm.get('pageCount');
    const value = control?.value ?? 0;
    if (value > 0) {
      control?.setValue(value - 1);
    }
  }
}
