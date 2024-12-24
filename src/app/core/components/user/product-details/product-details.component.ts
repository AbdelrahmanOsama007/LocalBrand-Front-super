import { Component, OnDestroy, OnInit} from '@angular/core';
import { QuantityCounterComponent } from "../../general/quantity-counter/quantity-counter.component";
import { ImageSliderComponent } from '../image-slider/image-slider.component';
import { IProductDetails } from '../../../interfaces/IProductDetails';
import { ProductService } from '../../../services/product.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { IOperationResult } from '../../../interfaces/IOperationResult';
import { IColorImage } from '../../../interfaces/IColorImage';
import { ISizeColorQuantity } from '../../../interfaces/ISizeColorQuantity';
import { NgClass, NgStyle } from '@angular/common';
import { IProduct } from '../../../interfaces/IProduct';
import { CardComponent } from '../../general/card/card.component';
import { EgpCurrencyPipe } from '../../../pipes/egp-currency.pipe';
import { WishlistService } from '../../../services/wishlist.service';
import { ProductInfo } from '../../../models/productinfo';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CategoryObserverService } from '../../../services/category-observer.service';


@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NgxSkeletonLoaderModule, ImageSliderComponent, NgStyle, CardComponent, NgClass, EgpCurrencyPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit , OnDestroy {
  ParentSubject = new Subject<any>();
  product!: IProductDetails;
  relatedproducts: IProduct[] = [];
  subscription: Subscription[] = [];
  AvailableColors: IColorImage[] = [];
  ColorsArrWhenOutOfStock: IColorImage[] = [];
  ColorImages: string[] = [];
  SizesColorsQuantities: ISizeColorQuantity[] = [];
  SelectedColorId!: number;
  SelectedSizeId!: number;
  ProductInfo!:ProductInfo;
  last = false;
  PutStyle : string = '';
  groupedSizes: { sizeId: number, sizeName: string, colors: IColorImage[] }[] = [];
  CurrentProductId!: number;
  isLoading = true;
  constructor(private _categoryobserver: CategoryObserverService,private toastr: ToastrService,private _cartservice: CartService,private _productservice:ProductService, private _wishlistservice: WishlistService, private _activatedroute:ActivatedRoute, private router:Router) {}

  ngOnInit(): void {
     this.last = false;
    this.subscription.push(this._activatedroute.paramMap.subscribe((p) => {
      const snapid = p.get('id');
      const id = snapid ? +snapid : undefined;
      this.subscription.push(this._productservice.GetProductById(id).subscribe({
        next: (result: IOperationResult) => {
          if (result.success) {
            this.product = result.data as IProductDetails;
            this.CurrentProductId = this.product.id;
            this.SizesColorsQuantities = this.product.sizesAndColorsQuantity;
            this.groupedSizes = [];
            this.groupedSizes = this.groupSizesWithColors();
            const defaultSize = this.SizesColorsQuantities.find(scq => scq.quantity > 0) || this.SizesColorsQuantities[0];
            const defaultColors = this.groupedSizes.find(size => size.sizeId === defaultSize.sizeId)?.colors || [];
            this.ChangeStyle(defaultSize.sizeName, defaultSize.sizeId, defaultColors);
            this.CheckStock()
            this.SendCounterObject();
            this.subscription.push(this._productservice.GetProductBySubCatId(this.product.subCategoryId).subscribe({
              next: (result: IOperationResult) => {
                if (result.success) {
                  this.relatedproducts = (result.data as IProduct[]).filter(product => product.id !== this.product.id);
                  this.CheckStock();
                  this.isLoading = false;
                }
              },
              error: () => {
                this.GoToError();
              }
            }))
          }
        },
        error: () => {
          this.GoToError();
        }
      }))
    }));
 }

  groupSizesWithColors() {
    if(this.product.isOutOfStock){
      const existingSize = this.SizesColorsQuantities[0];
      if(existingSize){
        this.product.colorImages.forEach(color => {
          this.AvailableColors.push(color);
        })
        this.groupedSizes.push({
            sizeId: 0,
            sizeName: "",
            colors: this.AvailableColors
        })
      }
      return this.groupedSizes;
    }
    this.SizesColorsQuantities.forEach(item => {
      if(item.quantity > 0){
        const existingSize = this.groupedSizes.find(group => group.sizeId === item.sizeId);
        if (existingSize) {
          const color = this.product.colorImages.find(c => c.colorId === item.colorId);
          if (color) {
            existingSize.colors.push(color);
          }
        } else {
          const color = this.product.colorImages.find(c => c.colorId === item.colorId);
          if (color) {
            this.groupedSizes.push({
              sizeId: item.sizeId,
              sizeName: item.sizeName,
              colors: [color]
            });
          }
        }
      }
    });
    return this.groupedSizes;
  }  

  GetColorImages(colorId: number) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this.SelectedColorId = colorId;
    const color = this.AvailableColors.find(a => a.colorId === colorId);
    if(color == null){
      this.ColorImages = [];
    }
    else{
      this.ColorImages = color?.imageUrls;
    }
    this.SendCounterObject();
    this.CheckStock();
  }

  ChangeStyle(selectedSize: string, sizeId: number, sizeColors: any[]) {
    this.SelectedSizeId = sizeId;
    this.PutStyle = selectedSize;
    this.AvailableColors = sizeColors;
    if (this.AvailableColors.length > 0) {
      this.GetColorImages(this.AvailableColors[0].colorId);
    }
  }

  ChangeNewStyle(selectedSize: string, sizeId: number, sizeColors: any[]) {
    this.SelectedSizeId = sizeId;
    this.PutStyle = selectedSize;
    this.AvailableColors = sizeColors;
    this.SendCounterObject();

    this.CheckStock();
  }

  GoToHome(){
    this.router.navigate(['/home'])
  }

  GoToError(){
    this.router.navigate(['/error'], { queryParams: { retryUrl: '/check-out' } });
  }

  GOToCategory(id:string){
      this._categoryobserver.updateProductsState(true);
      let idToLower = id.toLowerCase(); 
      this.router.navigate(['/products',idToLower]);
    }  

  SendCounterObject(){
    this.ProductInfo = {
      SizeId: this.SelectedSizeId,
      ColorId: this.SelectedColorId,
      ProductId: this.CurrentProductId,
      Quantity: 1,
    };
  }

  toggleWishlist(productId: number) {
    let wishlist: number[] = JSON.parse(localStorage.getItem('wishlist') || '[]');

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

  isInWishlist(productId: number): boolean {
    const wishlist: number[] = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return wishlist.includes(productId);
  }

  ScrollToDetails(){
    window.scrollTo({
      top: 600,
      behavior: 'smooth'
    });
  }

  CheckstockBeforeAddtoCart(){
    this._productservice.CheckCurrentQuantity(this.ProductInfo).subscribe({
      next: (result:IOperationResult) => {
        if(result.data){
          this.AddToCart();
          const Cart: ProductInfo[] = JSON.parse(localStorage.getItem('cart') || '[]');
          var existingProduct = Cart.find(p => ((p.ProductId == this.ProductInfo.ProductId) && (p.SizeId == this.ProductInfo.SizeId) && (p.ColorId == this.ProductInfo.ColorId)));
          if((existingProduct && existingProduct.Quantity >= result.additionalData)|| result.additionalData < 1){
            this.last = true;
          }
          this.toastr.success("Added to cart");
        }
        else if(!result.data){
          this.ProductInfo.Quantity = result.additionalData;
          this.ParentSubject.next(this.ProductInfo);
          this.toastr.error("Sorry This Quantity is not Available Now !!");
          // this.ngOnInit();
          window.location.reload();
        }
      },
      error: () =>{
        this.GoToError();
      }
    })
  }

  CheckStock(){
    const Cart: ProductInfo[] = JSON.parse(localStorage.getItem('cart') || '[]');
    var existingProduct = Cart.find(p => ((p.ProductId == this.ProductInfo.ProductId) && (p.SizeId == this.ProductInfo.SizeId) && (p.ColorId == this.ProductInfo.ColorId)));
    if(existingProduct){
      this.last = true;
    }else{
      this.last = false;
    }
  }

  AddToCart(){
    const Cart: ProductInfo[] = JSON.parse(localStorage.getItem('cart') || '[]');
    var existingProduct = Cart.find(p => ((p.ProductId == this.ProductInfo.ProductId) && (p.SizeId == this.ProductInfo.SizeId) && (p.ColorId == this.ProductInfo.ColorId)));
    if(existingProduct){
      existingProduct.Quantity += this.ProductInfo.Quantity;
    }
    else{
      Cart.push(this.ProductInfo);
    }
    localStorage.setItem('cart',JSON.stringify(Cart));
    this._cartservice.UpdateHeaderValue(true);
  }
  getQuantity(actualQuantity: ProductInfo){
    this.ProductInfo.Quantity = actualQuantity.Quantity;
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.forEach((s) => s.unsubscribe());
    }
  }
}