import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BookService } from '../../services/book-service';
import { B } from '@angular/cdk/keycodes';
import { AuthorServiceService } from '../../services/author-service.service';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'app-book-delete',
  standalone: false,
  templateUrl: './book-delete.html',
  styleUrl: './book-delete.css',
})
export class BookDelete implements AfterViewInit, OnInit {

  constructor(private bookService: BookService, private authorService: AuthorServiceService) {}

  fetchAuthorDetails(id: number) {
    this.authorService.getById(id).subscribe((response) => {
      if (response.rc) {
        // La proprietà corretta è 'fullName'
        console.log('Nome autore:', response.dati.fullName);
      } else {
        console.error(response.msg);
      }
    });
  }

  displayedColumns: string[] = [
    'title',
    'author',
    'publisher',
    'year',
    'price',
    'stock',
    'actions',
  ];
  dataSource = new MatTableDataSource<Book>(BOOK_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.bookService.getAll().subscribe((response) => {
      if (response.rc) {
        this.dataSource.data = response.dati;
        response.dati.forEach((book: Book) => {
          console.log(book);
          String(book.title);
          if (Array.isArray(book.authors) && book.authors.length > 0) {
            book.authors.forEach(authorId => {
              this.fetchAuthorDetails(authorId);
            });
          } else {
            console.warn('Nessun autore associato al libro:', book.title);
          }
        });
      } else {
        console.error(response.msg);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

// export interface Book {
//   title: string;
//   author: string;
//   publisher: string;
//   year: string;
//   price: number;
//   stock: number;
// }

export interface Book {
  id: number;
  title: string;
  authors: number[];
  publisher: string;
  category: string[];
  year: number;
  description: string;
  price: number;
  imageUrl?: string;
}

// ...existing code...
const BOOK_DATA: Book[] = [
  // { title: "Harry Potter", author: 'J.K. Rowling', publisher: "Feltrinelli", year: '2011', price: 29.99, stock: 47 },
  // { title: "Il Signore degli Anelli", author: 'J.R.R. Tolkien', publisher: "Mondadori", year: '2003', price: 34.90, stock: 12 },
  // { title: "Il Nome della Rosa", author: 'Umberto Eco', publisher: "Bompiani", year: '1980', price: 19.99, stock: 22 },
  // { title: "La solitudine dei numeri primi", author: 'Paolo Giordano', publisher: "Mondadori", year: '2008', price: 16.50, stock: 31 },
  // { title: "L'amica geniale", author: 'Elena Ferrante', publisher: "Edizioni E/O", year: '2011', price: 18.00, stock: 15 },
  // { title: "Il Gattopardo", author: 'Giuseppe Tomasi di Lampedusa', publisher: "Feltrinelli", year: '1958', price: 14.99, stock: 27 },
  // { title: "Cent'anni di solitudine", author: 'Gabriel García Márquez', publisher: "Mondadori", year: '1967', price: 21.00, stock: 19 },
  // { title: "La coscienza di Zeno", author: 'Italo Svevo', publisher: "Einaudi", year: '1923', price: 13.50, stock: 10 },
  // { title: "Il piccolo principe", author: 'Antoine de Saint-Exupéry', publisher: "Bompiani", year: '1943', price: 12.99, stock: 40 },
  // { title: "Don Chisciotte", author: 'Miguel de Cervantes', publisher: "Mondadori", year: '1605', price: 24.90, stock: 8 },
  // { title: "Orgoglio e pregiudizio", author: 'Jane Austen', publisher: "Newton Compton", year: '1813', price: 11.99, stock: 33 },
  // { title: "Il codice da Vinci", author: 'Dan Brown', publisher: "Mondadori", year: '2003', price: 22.00, stock: 25 },
  // { title: "La ragazza del treno", author: 'Paula Hawkins', publisher: "Piemme", year: '2015', price: 17.90, stock: 14 },
  // { title: "Il cacciatore di aquiloni", author: 'Khaled Hosseini', publisher: "Piemme", year: '2003', price: 15.99, stock: 29 },
  // { title: "La casa degli spiriti", author: 'Isabel Allende', publisher: "Feltrinelli", year: '1982', price: 20.00, stock: 18 },
  // { title: "Il barone rampante", author: 'Italo Calvino', publisher: "Mondadori", year: '1957', price: 14.50, stock: 21 },
  // { title: "Il fu Mattia Pascal", author: 'Luigi Pirandello', publisher: "Mondadori", year: '1904', price: 13.99, stock: 16 },
  // { title: "La strada", author: 'Cormac McCarthy', publisher: "Einaudi", year: '2006', price: 18.50, stock: 12 },
  // { title: "Il deserto dei Tartari", author: 'Dino Buzzati', publisher: "Mondadori", year: '1940', price: 15.00, stock: 20 },
  // { title: "Il giorno della civetta", author: 'Leonardo Sciascia', publisher: "Einaudi", year: '1961', price: 12.00, stock: 23 },
];
