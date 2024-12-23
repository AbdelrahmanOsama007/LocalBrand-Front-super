import { NgIf } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-image-expand',
  standalone: true,
  imports: [NgIf],
  templateUrl: './image-expand.component.html',
  styleUrl: './image-expand.component.css'
})
export class ImageExpandComponent implements OnChanges {
  @Input() imagesource:string = "";

  ngOnChanges(changes: SimpleChanges): void {
    if(this.imagesource){
      this.openOverlay(this.imagesource);
    }
  }


  isOverlayOpen = false;
  currentImage : string = "";

  openOverlay(imageSrc: string): void {
    this.currentImage = imageSrc;
    this.isOverlayOpen = true;
  }

  closeOverlay(): void {
    this.isOverlayOpen = false;
    this.imagesource = '';
  }

  onOverlayClick(event: MouseEvent): void {
    // Close the overlay only if the click is outside the image
    if (event.target === event.currentTarget) {
      this.closeOverlay();
    }
  }
}
