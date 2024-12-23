import { ChangeDetectorRef, Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { IProduct } from '../../../interfaces/IProduct';
import { EgpCurrencyPipe } from '../../../pipes/egp-currency.pipe';
import { isPlatformBrowser, NgClass, NgIf, NgStyle } from '@angular/common';
import { WishlistService } from '../../../services/wishlist.service';
import { Router, RouterModule } from '@angular/router';
import { ImageExpandComponent } from "../image-expand/image-expand.component";
import { ProductService } from '../../../services/product.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgxSkeletonLoaderModule,NgIf,EgpCurrencyPipe, NgStyle, NgClass, RouterModule, ImageExpandComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() product!: IProduct;
  imagetoshow!:string;
  isLoading: boolean = true;
  currentImage!: string;
  constructor(private toastr: ToastrService,private _wishlistservice: WishlistService, private _router: Router, private _productservice: ProductService, private sss:ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId:object) {}

  toggleWishlist(productId: number) {
    if (isPlatformBrowser(this.platformId)){
      let wishlist: number[] = JSON.parse(
        localStorage.getItem('wishlist') || '[]'
      );
  
      if (wishlist.includes(productId)) {      
        wishlist = wishlist.filter(id => id !== productId);
        this.toastr.success("Removed from wishlist");   
      } else {
        wishlist.push(productId);
        this.toastr.success("Added to wishlist");
      }
  
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      this._wishlistservice.UpdateHeaderValue(true);
    }
  }

  GoToProductDetails(productId: number) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this._router.navigate(['productdetails', productId]);
  }
    
  ExpandImage(imageurl:string){
    this.imagetoshow = "";
    this.sss.detectChanges();
    this.imagetoshow = imageurl;
  }

  isInWishlist(productId: number): boolean {
    if (isPlatformBrowser(this.platformId)){
      const wishlist: number[] = JSON.parse(
        localStorage.getItem('wishlist') || '[]'
      );
      return wishlist.includes(productId);
    }
    return false;
  }

  ngOnInit() {
    this.isLoading = false;
    this.currentImage = this.product.images[0];
  }
  GetSecondImage(){
    this.currentImage = this.product.images[1];
  }

  GetFirstImage(){
    this.currentImage = this.product.images[0];
  }
}
