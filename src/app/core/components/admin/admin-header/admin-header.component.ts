import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenValidationService } from '../../../services/token-validation.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [NgClass],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent implements OnInit {
  constructor(private router: Router,private _tokenservice:TokenValidationService){}
  activeMenuItem: string = 'Products';
  isOffcanvasOpen = false;
  ngOnInit(): void {
    this.setActiveMenuItem();
    this.router.events.subscribe(() => {
      this.setActiveMenuItem();
    });
  }
  setActiveMenuItem() {
    const currentUrl = this.router.url;
    
    if (currentUrl.includes('/productcrud')) {
      this.activeMenuItem = 'Products';
    } else if (currentUrl.includes('/catcrud')) {
      this.activeMenuItem = 'Categories';
    } else if (currentUrl.includes('/canceledorder')) {
      this.activeMenuItem = 'CanceledOrders';
    } else if (currentUrl.includes('/processingorder')) {
      this.activeMenuItem = 'ProcessingOrders';
    } else if (currentUrl.includes('/delorder')) {
      this.activeMenuItem = 'DeliveredOrders';
    } else if(currentUrl.includes('/emailcrud')){
      this.activeMenuItem = 'Emails';
    } else if(currentUrl.includes('/colorcrud'))
      this.activeMenuItem = 'Colors';
     else {
      this.activeMenuItem = '';
    }
  }
  toggleOffcanvasMenu() {
    this.isOffcanvasOpen = !this.isOffcanvasOpen;
}
GoToHome(){
  this.router.navigate(['/home']);
  this.isOffcanvasOpen = false;
}
GoToProductCruds(){
  this.router.navigate(['/productcrud']);
  this.isOffcanvasOpen = false;
}
GoToCategoryCruds(){
  this.router.navigate(['/catcrud']);
  this.isOffcanvasOpen = false;
}
GoToDeliveredOrders(){
  this.router.navigate(['/delorder']);
  this.isOffcanvasOpen = false;
}
GoToProcessingOrders(){
  this.router.navigate(['/processingorder']);
  this.isOffcanvasOpen = false;
}
GoToCanceledOrders(){
  this.router.navigate(['/canceledorder']);
  this.isOffcanvasOpen = false;
}
GoToEmailCruds(){
  this.router.navigate(['/emailcrud']);
  this.isOffcanvasOpen = false;
}
GoToColorCruds(){
  this.router.navigate(['/colorcrud']);
  this.isOffcanvasOpen = false;
}
LogOut(){
  localStorage.removeItem('token');
  this.router.navigate(['/admin-login/ahmedeltalkhawy/550e8400-e29b-41d4-a716-446655440000']);
  this._tokenservice.ValidateToken();
  this.isOffcanvasOpen = false;
}
ChangePassword(){
  this.router.navigate(['/change-admin-password']);
  this.isOffcanvasOpen = false;
}
}
