import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CategoryObserverService } from '../../../services/category-observer.service';
import { WishlistService } from '../../../services/wishlist.service';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { CategoryService } from '../../../services/category.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { IOperationResult } from '../../../interfaces/IOperationResult';
import { ICategory } from '../../../interfaces/ICategory';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  subscription: Subscription[] = [];
  categories: ICategory[] = [];
  wishlistCount: number = 0;
  cartlistCount: number = 0;
  isOffcanvasOpen = false;
  isCartComponent = false;

  activeMenuItem: string = 'home';
  constructor(private _categoryService :CategoryService,private _cartservice: CartService,private router: Router, private _categoryobserver: CategoryObserverService, private _wishlistservice: WishlistService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        this.isCartComponent = ['/cart', '/check-out', '/wishlist'].includes(currentRoute);
      }
    });
  }
  ngOnInit(): void {
    this.subscription.push(this._categoryService.GetAllCat().subscribe({
      next: (result:IOperationResult) => {
        if(result.success){
          this.categories = result.data as ICategory[];
        }
      },
      error: (error) => {
      }
    }))
    this.GetWishListLength();
    this.setActiveMenuItem();
    this._wishlistservice.wishlist$.subscribe( () => {
      this.GetWishListLength();
    });
    this._cartservice.cartlist$.subscribe( () => {
      this.GetCartLength();
    });
    this.router.events.subscribe(() => {
      this.setActiveMenuItem();
    });
  }

  GetWishListLength(){
    if(isPlatformBrowser(this.platformId)){
      this.wishlistCount = JSON.parse(localStorage.getItem('wishlist') || '[]').length;
    }
  }

  toggleOffcanvasMenu() {
    this.isOffcanvasOpen = !this.isOffcanvasOpen;
}

  GetCartLength(){
    if(isPlatformBrowser(this.platformId)){
      this.cartlistCount = JSON.parse(localStorage.getItem('cart') || '[]').length;
    }
  }

  GetCategoryProducts(id:string){
    this._categoryobserver.updateProductsState(true);
    let idToLower = id.toLowerCase();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this.router.navigate(['/products',idToLower]);
    this.isOffcanvasOpen = false;
  }

  GoToWishlist(){
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this.router.navigate(['/wishlist']);
    this.isOffcanvasOpen = false;

  }

  GoToHome(){
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this.router.navigate(['/home']);
    this.isOffcanvasOpen = false;
  }

  GoToContact(){
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this.router.navigate(['/contact-us']);
    this.isOffcanvasOpen = false;
  }

  GoToCart(){
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this.router.navigate(['/cart'])
    this.isOffcanvasOpen = false;
  }

  GoToSearchComponent(){
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this.router.navigate(['/search']);
    this.isOffcanvasOpen = false;
  }

  setActiveMenuItem() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/products/men&women')) {
      this.activeMenuItem = 'Men&Women';
    } else if (currentUrl.includes('/products/unisex')) {
      this.activeMenuItem = 'Unisex';
    } else if (currentUrl.includes('/products/accessories')) {
      this.activeMenuItem = 'Accessories';
    } else if (currentUrl.includes('/products/women')) {
      this.activeMenuItem = 'Women';
    } else if (currentUrl.includes('/products/men')) {
      this.activeMenuItem = 'Men';
    } else if (currentUrl.includes('/home')) {
      this.activeMenuItem = 'home';
    } else if (currentUrl.includes('/cart')) {
      this.activeMenuItem = 'cart';
    } else if (currentUrl.includes('/contact')) {
      this.activeMenuItem = 'contact';
    } else {
      this.activeMenuItem = '';
    }
  }
}
