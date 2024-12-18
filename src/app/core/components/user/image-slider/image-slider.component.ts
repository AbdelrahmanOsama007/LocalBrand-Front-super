import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations';



@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [MatCardModule, MatTabsModule, MatToolbarModule, CommonModule, MatIconModule],
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.css',
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})

export class ImageSliderComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.currentImageIndex = 0;
  }
  @Input() images: string[] = [];
  
  currentImageIndex: number = 0;

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  prevImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }

  selectImage(index: number) {
    this.currentImageIndex = index;
  }
}
