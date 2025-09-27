import { Component } from '@angular/core';

@Component({
  selector: 'app-info',
  standalone: false,
  templateUrl: './info.html',
  styleUrl: './info.css',
})
export class Info {
  book: any = {
    id: 1,
    title: 'Le avventure di Kiwi',
    author: 'Kiwi',
    publisher: 'kiwipublishing',
    category: ['Avventura', 'Fantasy'],
    year: 2023,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    price: 19.99,
    imageUrl: 'https://covers.openlibrary.org/b/oclc/28419896-L.jpg',
  };
  reviews: any[] = [
    {
      id: 1,
      bookId: 1,
      reviewer: 'Mario Rossi',
      text: 'Un libro fantastico!',
      rating: 5,
    },
    {
      id: 2,
      bookId: 1,
      reviewer: 'Luigi Verdi',
      text: 'Molto interessante e avvincente.',
      rating: 4,
    },
    {
      id: 3,
      bookId: 1,
      reviewer: 'Giulia Bianchi',
      text: 'Mi ha emozionato tantissimo, consigliato!',
      rating: 5,
    },
    {
      id: 4,
      bookId: 1,
      reviewer: 'Marco Neri',
      text: 'Alcuni capitoli sono un po’ lenti, ma nel complesso buono.',
      rating: 3,
    },
    {
      id: 5,
      bookId: 1,
      reviewer: 'Sara Blu',
      text: 'Personaggi ben scritti e storia coinvolgente.',
      rating: 4,
    },
    {
      id: 6,
      bookId: 1,
      reviewer: 'Luca Gialli',
      text: 'Non sono riuscito a finirlo, troppo lento.',
      rating: 2,
    },
    {
      id: 7,
      bookId: 1,
      reviewer: 'Marta Viola',
      text: 'Uno dei migliori libri letti quest’anno!',
      rating: 5,
    },
  ];
}
