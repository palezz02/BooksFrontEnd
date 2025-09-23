import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';

interface Book {
  id: number;
  isbn: string;
  title: string;
  pageCount: number;
  description: string;
  coverImage: string;
  languageCode: string;
  publicationDate: string;
  edition: string;
  authors: { id: number; fullName: string }[];
  publisher: { id: number; name: string };
  categories: { id: number; name: string }[];
}

@Component({
  selector: 'app-books-page',
  templateUrl: './books-page.html',
  styleUrls: ['./books-page.css'],
  standalone: false,
})
export class BooksPage implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  pagedBooks: Book[] = [];

  searchTerm: string = '';
  selectedCategory: string = '';
  selectedLanguage: string = '';

  categories: string[] = ['Fantasy', 'Science Fiction', 'Mystery', 'Romance'];
  languages: string[] = ['EN', 'IT', 'FR', 'DE'];

  constructor(private http: HttpClient) {}


  pageSize = 10;
  currentPage = 0;

  ngOnInit() {
    this.books = [
      {
        id: 1,
        isbn: '9781234567890',
        title: 'The Enchanted Forest',
        pageCount: 350,
        description: 'A magical journey through the depths of the enchanted forest where secrets and adventures await.',
        coverImage: 'https://covers.openlibrary.org/b/id/10523366-L.jpg',
        languageCode: 'EN',
        publicationDate: '2021-05-12',
        edition: '1st',
        authors: [{ id: 1, fullName: 'Alice Greenwood' }],
        publisher: { id: 1, name: 'Dreamscape Publishing' },
        categories: [{ id: 1, name: 'Fantasy' }]
      },
      {
        id: 2,
        isbn: '9789876543210',
        title: 'Mysteries of the Galaxy',
        pageCount: 420,
        description: 'Explore distant galaxies and unravel mysteries hidden in the stars.',
        coverImage: 'https://covers.openlibrary.org/b/id/11153235-L.jpg',
        languageCode: 'EN',
        publicationDate: '2020-09-01',
        edition: '2nd',
        authors: [{ id: 2, fullName: 'John Stellar' }],
        publisher: { id: 2, name: 'Cosmos House' },
        categories: [{ id: 2, name: 'Science Fiction' }]
      },
      {
        id: 3,
        isbn: '9781111111111',
        title: 'La Notte Romantica',
        pageCount: 280,
        description: 'Una storia d’amore indimenticabile ambientata nelle strade di Roma.',
        coverImage: 'https://covers.openlibrary.org/b/id/11618256-L.jpg',
        languageCode: 'IT',
        publicationDate: '2019-02-14',
        edition: '1st',
        authors: [{ id: 3, fullName: 'Maria Bianchi' }],
        publisher: { id: 3, name: 'Cuore Editore' },
        categories: [{ id: 3, name: 'Romance' }]
      },
      {
        id: 4,
        isbn: '9782222222222',
        title: 'Le Secret du Manoir',
        pageCount: 310,
        description: 'Un mystère captivant dans un vieux manoir français rempli de secrets.',
        coverImage: 'https://covers.openlibrary.org/b/id/11462658-L.jpg',
        languageCode: 'FR',
        publicationDate: '2018-10-20',
        edition: '1st',
        authors: [{ id: 4, fullName: 'Jean Dupont' }],
        publisher: { id: 4, name: 'Mystère Éditions' },
        categories: [{ id: 4, name: 'Mystery' }]
      },
      {
      id: 5,
      isbn: '9781234567890',
      title: 'The Enchanted Forest',
      pageCount: 350,
      description: 'A magical journey through the depths of the enchanted forest where secrets and adventures await.',
      coverImage: 'https://covers.openlibrary.org/b/id/10523366-L.jpg',
      languageCode: 'EN',
      publicationDate: '2021-05-12',
      edition: '1st',
      authors: [{ id: 1, fullName: 'Alice Greenwood' }],
      publisher: { id: 1, name: 'Dreamscape Publishing' },
      categories: [{ id: 1, name: 'Fantasy' }]
    },
    {
      id: 6,
      isbn: '9789876543210',
      title: 'Mysteries of the Galaxy',
      pageCount: 420,
      description: 'Explore distant galaxies and unravel mysteries hidden in the stars.',
      coverImage: 'https://covers.openlibrary.org/b/id/11153235-L.jpg',
      languageCode: 'EN',
      publicationDate: '2020-09-01',
      edition: '2nd',
      authors: [{ id: 2, fullName: 'John Stellar' }],
      publisher: { id: 2, name: 'Cosmos House' },
      categories: [{ id: 2, name: 'Science Fiction' }]
    },
    {
      id: 7,
      isbn: '9781111111111',
      title: 'La Notte Romantica',
      pageCount: 280,
      description: 'Una storia d’amore indimenticabile ambientata nelle strade di Roma.',
      coverImage: 'https://covers.openlibrary.org/b/id/11618256-L.jpg',
      languageCode: 'IT',
      publicationDate: '2019-02-14',
      edition: '1st',
      authors: [{ id: 3, fullName: 'Maria Bianchi' }],
      publisher: { id: 3, name: 'Cuore Editore' },
      categories: [{ id: 3, name: 'Romance' }]
    },
    {
      id: 8,
      isbn: '9782222222222',
      title: 'Le Secret du Manoir',
      pageCount: 310,
      description: 'Un mystère captivant dans un vieux manoir français rempli de secrets.',
      coverImage: 'https://covers.openlibrary.org/b/id/11462658-L.jpg',
      languageCode: 'FR',
      publicationDate: '2018-10-20',
      edition: '1st',
      authors: [{ id: 4, fullName: 'Jean Dupont' }],
      publisher: { id: 4, name: 'Mystère Éditions' },
      categories: [{ id: 4, name: 'Mystery' }]
    },
    {
      id: 9,
      isbn: '9783333333333',
      title: 'Der Schattenjäger',
      pageCount: 400,
      description: 'Ein packender Thriller über einen Jäger, der die dunkelsten Schatten der Stadt aufspürt.',
      coverImage: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
      languageCode: 'DE',
      publicationDate: '2022-01-15',
      edition: '1st',
      authors: [{ id: 5, fullName: 'Lukas Schneider' }],
      publisher: { id: 5, name: 'Dunkel Verlag' },
      categories: [{ id: 5, name: 'Thriller' }]
    },
    {
      id: 10,
      isbn: '9784444444444',
      title: 'Cooking with Love',
      pageCount: 180,
      description: 'Discover delicious recipes made with love and passion for food.',
      coverImage: 'https://covers.openlibrary.org/b/id/10622536-L.jpg',
      languageCode: 'EN',
      publicationDate: '2017-07-07',
      edition: '3rd',
      authors: [{ id: 6, fullName: 'Emma Baker' }],
      publisher: { id: 6, name: 'Kitchen House' },
      categories: [{ id: 6, name: 'Cooking' }]
    },
    {
      id: 11,
      isbn: '9785555555555',
      title: 'Samurai’s Honor',
      pageCount: 290,
      description: 'A tale of loyalty, courage, and honor in feudal Japan.',
      coverImage: 'https://covers.openlibrary.org/b/id/12629914-L.jpg',
      languageCode: 'JP',
      publicationDate: '2016-03-22',
      edition: '1st',
      authors: [{ id: 7, fullName: 'Hiroshi Tanaka' }],
      publisher: { id: 7, name: 'Bushido Press' },
      categories: [{ id: 7, name: 'Historical Fiction' }]
    },
    {
      id: 12,
      isbn: '9786666666666',
      title: 'The Future of AI',
      pageCount: 500,
      description: 'An in-depth exploration of artificial intelligence and its impact on humanity.',
      coverImage: 'https://covers.openlibrary.org/b/id/11223345-L.jpg',
      languageCode: 'EN',
      publicationDate: '2023-04-18',
      edition: '1st',
      authors: [{ id: 8, fullName: 'Dr. Sarah Lin' }],
      publisher: { id: 8, name: 'TechWorld Press' },
      categories: [{ id: 8, name: 'Non-Fiction' }]
    }
    ];


    this.filteredBooks = this.books;
    this.updatePagedBooks();
  }


  getAuthorNames(book: Book): string {
    return book.authors.map(a => a.fullName).join(', ');
  }


  filterBooks() {
  this.filteredBooks = this.books.filter((book) => {
    const matchesSearch =
      this.searchTerm === '' ||
      book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      book.authors.some((a) =>
        a.fullName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );

    const matchesCategory =
      this.selectedCategory === '' ||
      book.categories.some((c) => c.name === this.selectedCategory);

    const matchesLanguage =
      this.selectedLanguage === '' ||
      book.languageCode === this.selectedLanguage;

    return matchesSearch && matchesCategory && matchesLanguage;
  });

  this.currentPage = 0; // reset paginator
  this.updatePagedBooks();
}


  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedBooks();
  }

  private updatePagedBooks() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pagedBooks = this.filteredBooks.slice(start, end);
  }

}
