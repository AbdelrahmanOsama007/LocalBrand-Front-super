import { isPlatformBrowser, NgClass, NgFor } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-home-slider',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './home-slider.component.html',
  styleUrl: './home-slider.component.css'
})
export class HomeSliderComponent implements OnInit, OnDestroy {
  slides = [
    { imgUrl: 'https://images.squarespace-cdn.com/content/v1/66a112f13bc71a7edaecb5aa/a321d1af-b14b-4237-ae7d-48bd8971a7a1/2024-07_Messi-Family-Hero_01.jpg?format=2500w' },
    { imgUrl: 'https://images.squarespace-cdn.com/content/v1/66a112f13bc71a7edaecb5aa/e05643a8-5234-46f3-820c-dd7adb6fceb2/2024-07_Messi-Family_01.jpg?format=2500w' }
    ];

  currentSlide = 0;
  autoSlideInterval: any;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.autoSlide();
    }
  }

  autoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000); // Auto slide every 3 seconds
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      clearInterval(this.autoSlideInterval);
    }
  }
}