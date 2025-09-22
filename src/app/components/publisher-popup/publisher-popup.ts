import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publisher-popup',
  templateUrl: './publisher-popup.html',
  styleUrls: ['./publisher-popup.css'],
  imports: [CommonModule]
})
export class PublisherPopup {
  @Input() publisher: { name: string; description: string } | null = null;
  @Input() isVisible: boolean = false;

  @Output() close = new EventEmitter<void>();

  closePopup() {
    this.close.emit();
  }
}
