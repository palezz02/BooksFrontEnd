import { Component } from '@angular/core';

interface Book {
  category: string;
  description: string;
  coverUrl: string;
  title: string;
  reviews: number;
  rating: number;
  year: number;
}

@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.html',
  styleUrls: ['./best-seller.css'],
  standalone: false
})
export class BestSeller {
  books: Book[] = [
    {
      category: 'Fantasy',
      description: `In a world where magic is fading, a young sorcerer embarks on a perilous journey to reclaim ancient powers 
      and prevent a looming darkness from consuming the realm. Along the way, alliances will be tested, secrets revealed, 
      and the true nature of courage discovered. This is a tale of wonder, betrayal, and the enduring spirit of heroes.`,
      coverUrl: 'https://picsum.photos/400/600?random=1',
      title: 'The Enchanted Realm',
      reviews: 120,
      rating: 4.5,
      year: 2021
    },
    {
      category: 'Science Fiction',
      description: `In the year 2157, humanity has begun colonizing distant worlds, but with new frontiers come new threats. 
      When a brilliant but troubled captain uncovers a conspiracy that could destroy the fragile balance of the galaxy, 
      she must navigate political intrigue, alien civilizations, and her own past to prevent catastrophe. A story of adventure, 
      mystery, and the infinite possibilities of the stars.`,
      coverUrl: 'https://picsum.photos/400/600?random=2',
      title: 'Beyond the Stars',
      reviews: 90,
      rating: 4.2,
      year: 2022
    },
    {
      category: 'Mystery',
      description: `Detective Eleanor Blake thought she had seen it all, until a seemingly straightforward case spirals into a web 
      of lies, deception, and dark secrets. Every clue uncovers another layer of intrigue, pushing her closer to a revelation 
      that could shatter everything she believes. A gripping thriller that will keep you guessing until the very last page.`,
      coverUrl: 'https://picsum.photos/400/600?random=3',
      title: 'The Hidden Truth',
      reviews: 150,
      rating: 4.8,
      year: 2020
    }
  ];

  currentIndex = 0;

  get currentBook(): Book {
    return this.books[this.currentIndex];
  }

  prevBook() {
    this.currentIndex = (this.currentIndex - 1 + this.books.length) % this.books.length;
  }

  nextBook() {
    this.currentIndex = (this.currentIndex + 1) % this.books.length;
  }
}
