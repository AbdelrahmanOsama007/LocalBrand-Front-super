import { Component, OnDestroy, OnInit } from '@angular/core';
import { IWishlistProduct } from '../../../interfaces/IWishlistProduct';
import { WishlistService } from '../../../services/wishlist.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { IOperationResult } from '../../../interfaces/IOperationResult';
import { EgpCurrencyPipe } from '../../../pipes/egp-currency.pipe';
import { Router, RouterLink } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-main-wishlist',
  standalone: true,
  imports: [NgFor,NgIf,NgxSkeletonLoaderModule,EgpCurrencyPipe,RouterLink],
  templateUrl: './main-wishlist.component.html',
  styleUrl: './main-wishlist.component.css'
})
export class MainWishlistComponent implements OnInit, OnDestroy {
  isLoading = true;
  products: IWishlistProduct[] = [];
  Ids: number[] = [];
  subscription!: Subscription;
  constructor(private _wishlistservice:WishlistService, private router: Router) {}

  ngOnInit(): void {
    this.Ids = JSON.parse(localStorage.getItem('wishlist') || '[]');
    this.subscription = this._wishlistservice.GetWishlistProducts(this.Ids).subscribe({
      next: (result:IOperationResult) => {
        if(result.success){
          console.log(result.data);
          this.products = result.data as IWishlistProduct[];
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  removeFromWishlist(productId: number): void {
    this.products = this.products.filter(product => product.productId !== productId);
    this.Ids = this.Ids.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(this.Ids));
    this._wishlistservice.UpdateHeaderValue(true);
  }

  GoToHome(){
    this.router.navigate(['/home'])
  }

  GoToProductDetails(productId: number) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this.router.navigate(['productdetails', productId]);
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
}
