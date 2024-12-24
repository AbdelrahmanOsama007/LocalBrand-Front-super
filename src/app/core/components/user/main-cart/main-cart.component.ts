import { Component, OnInit} from '@angular/core';
import { QuantityCounterComponent } from '../../general/quantity-counter/quantity-counter.component';
import { CartService } from '../../../services/cart.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { ProductInfo } from '../../../models/productinfo';
import { IOperationResult } from '../../../interfaces/IOperationResult';
import { ICartProducts } from '../../../interfaces/ICartProducts';
import { EgpCurrencyPipe } from '../../../pipes/egp-currency.pipe';
import { NgStyle } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CategoryObserverService } from '../../../services/category-observer.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CheckoutAuthService } from '../../../services/checkout-auth.service';

@Component({
  selector: 'app-main-cart',
  standalone: true,
  imports: [NgxSkeletonLoaderModule,QuantityCounterComponent, EgpCurrencyPipe, NgStyle,RouterLink],
  templateUrl: './main-cart.component.html',
  styleUrl: './main-cart.component.css'
})
export class MainCartComponent implements OnInit {
  isLoading = true
  ParentSubject = new Subject<any>();
  subscription: Subscription[] = [];
  productsinfo: ProductInfo[] = [];
  products: ICartProducts[] = [];
  updatedQuantity!: number;
  Total: number = 0;
  SubTotal: number = 0;
  constructor(private toastr: ToastrService,private _cartservice: CartService, private _router: Router, private _categoryobserver: CategoryObserverService, private checkoutAuthService: CheckoutAuthService){}
  ngOnInit(): void {
    this.productsinfo = JSON.parse(localStorage.getItem('cart') || '[]');
    this.subscription.push(this._cartservice.GetCartProducts(this.productsinfo).subscribe({
      next: (result:IOperationResult) => {

        if(result.success){
          this.products = result.data as ICartProducts[];
          this.productsinfo.forEach(p=>{
            p.Quantity = (this.products.filter(ip => ip.productId == p.ProductId && ip.sizeId == p.SizeId  && p.ColorId == p.ColorId)[0]).quantity
          })

          localStorage.setItem('cart',JSON.stringify(this.productsinfo));

          this.products.forEach(p => {
            this.Total += p.priceAfterDiscount * p.quantity;
            this.SubTotal += p.priceBeforeDiscount * p.quantity;
            this.ParentSubject.next(p);
          })
          this.isLoading = false
        }
      },
      error: () => {
        this.GoToError();
      }
    }
    ))
  }
  GetCurrentProduct(productid:number, sizeid:number, colorid:number){
    return this.productsinfo.filter(p => p.ProductId == productid && p.SizeId == sizeid && p.ColorId == colorid)[0];
  }
  GoToProductDetails(productId: number) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this._router.navigate(['productdetails', productId]);
  }
  GoToShop(id:string){
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this._categoryobserver.updateProductsState(true);
    this._router.navigate(['/products',id]);
  }



  GoToCheckout(){
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    const TotalMoney = {
      Sub: this.SubTotal,
      Tot: this.Total
    }
    localStorage.setItem('Total-info',JSON.stringify(TotalMoney));
    this.checkoutAuthService.allowNavigation();
    this._router.navigate(['/check-out']);
  }
  getQuantity(product: ProductInfo){
    this.products.filter(p => p.productId == product.ProductId && p.sizeId == product.SizeId && p.colorId == product.ColorId)[0].quantity = product.Quantity;
    this.Total = 0;
    this.SubTotal = 0;
    this.products.forEach(p => {
      this.Total += p.priceAfterDiscount * p.quantity;
      this.SubTotal += p.priceBeforeDiscount * p.quantity;
    })
    this.productsinfo.filter(p => p.ProductId == product.ProductId && p.SizeId == product.SizeId && p.ColorId == product.ColorId)[0].Quantity = product.Quantity;
    localStorage.setItem('cart',JSON.stringify(this.productsinfo));
  }
  GoToHome(){
    this._router.navigate(['/home'])
  }
  GoToError(){
    this._router.navigate(['/error'], { queryParams: { retryUrl: '/cart' } });
  }
  removeFromCartlist(productid:number, sizeid:number, colorid:number): void {
    this.productsinfo = this.productsinfo.filter(p => !(p.ProductId == productid && p.SizeId == sizeid && p.ColorId == colorid));
    this.products = this.products.filter(p => !(p.productId == productid && p.sizeId == sizeid && p.colorId == colorid));
    this.Total = 0;
    this.SubTotal = 0;
    this.products.forEach(p => {
      this.Total += p.priceAfterDiscount * p.quantity;
      this.SubTotal += p.priceBeforeDiscount * p.quantity;
    })
    localStorage.setItem('cart',JSON.stringify(this.productsinfo));
    this._cartservice.UpdateHeaderValue(true);
    this.toastr.success("Removed from cart");   

  }
}