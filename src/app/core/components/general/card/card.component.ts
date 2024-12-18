import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { IProduct } from '../../../interfaces/IProduct';
import { EgpCurrencyPipe } from '../../../pipes/egp-currency.pipe';
import { NgClass, NgIf, NgStyle } from '@angular/common';
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
  constructor(private toastr: ToastrService,private _wishlistservice: WishlistService, private _router: Router, private _productservice: ProductService, private sss:ChangeDetectorRef) {}

  toggleWishlist(productId: number) {
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
    const wishlist: number[] = JSON.parse(
      localStorage.getItem('wishlist') || '[]'
    );
    return wishlist.includes(productId);
  }

  ngOnInit() {
    this.isLoading = false;
  }


}
