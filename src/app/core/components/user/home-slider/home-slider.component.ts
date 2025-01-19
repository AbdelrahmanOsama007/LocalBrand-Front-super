import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-home-slider',
  standalone: true,
  imports: [NgClass],
  templateUrl: './home-slider.component.html',
  styleUrl: './home-slider.component.css'
})
export class HomeSliderComponent implements OnInit, OnDestroy {
  slides = [
    { imgUrl: 'assets/img/desk1.jpg' },
    { imgUrl: 'assets/img/desk2.jpg' },
    { imgUrl: 'assets/img/desk3.jpg' }
    ];
    moblileslides = [
      { imgUrl: 'assets/img/mob1.jpg' },
      { imgUrl: 'assets/img/mob2.jpg' },
      { imgUrl: 'assets/img/mob3.jpg' }
    ];
    activearray = [{imgUrl:''}];

  currentSlide = 0;
  autoSlideInterval: any;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.updateArray();
    this.listenToMediaQuery();
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
  updateArray(): void {
    if (isPlatformBrowser(this.platformId)){
      if (window.matchMedia('(max-width: 768px)').matches) {
        this.activearray = this.moblileslides;
      } else {
        this.activearray = this.slides;
      }
    }
  }
listenToMediaQuery(): void {
  if (isPlatformBrowser(this.platformId)){
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    mediaQuery.addEventListener('change', () => this.updateArray());
  }
}
}