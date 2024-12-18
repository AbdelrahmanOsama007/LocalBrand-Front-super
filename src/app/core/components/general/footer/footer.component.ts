import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(private router: Router,@Inject(DOCUMENT) private document: Document){}
  GoToHome(){
    this.router.navigate(['/home']);
  }

  GoToContact(){
    this.router.navigate(['/contact-us']);
  }
  goToFaceBook(){
    this.document.location.href = 'https://www.facebook.com/people/%C3%88lev%C3%A8/61567790160251/?mibextid=LQQJ4d&rdid=ZeHSlUcuD8RfIPIS&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1B4hog7juP%2F%3Fmibextid%3DLQQJ4d'
  }
  GoToInstagram(){
    this.document.location.href = 'https://www.instagram.com/_eleve.eg/profilecard/';
  }
  GoToTikTok(){
    this.document.location.href = 'https://www.tiktok.com/@_eleve.eg?_t=8rln6QJ6vh4&_r=1';
  }
}
