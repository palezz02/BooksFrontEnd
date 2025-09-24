import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-author-popup',
  templateUrl: './author-popup.html',
  styleUrls: ['./author-popup.css'],
  imports: [CommonModule],
})
export class AuthorPopup {
  @Input() author: {
    fullName: string;
    biography: string;
    birthDate: Date;
    deathDate: Date;
    coverImage?: string;
  } | null = null;
  @Input() isVisible: boolean = false;

  @Output() close = new EventEmitter<void>();

  closePopup() {
    this.close.emit();
  }
}
