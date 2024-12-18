import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CardComponent } from '../../general/card/card.component';
import { IProduct } from '../../../interfaces/IProduct';
import { Subscription } from 'rxjs/internal/Subscription';
import { ProductService } from '../../../services/product.service';
import { IOperationResult } from '../../../interfaces/IOperationResult';
import { CategoryObserverService } from '../../../services/category-observer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeSliderComponent } from '../home-slider/home-slider.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, HomeSliderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  products: IProduct[] = [];
  hoveredImage: { [key: number]: string } = {};
  subscription!: Subscription;
  constructor(private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private _categoryobserver: CategoryObserverService,private _productservice:ProductService){
  }
  ngOnInit(): void {
    this.subscription = this._productservice.GetBestSellers().subscribe({
      next: (result:IOperationResult) => {
        if(result.success){
          this.products = result.data as IProduct[];
        }
        else{
          console.log(result);
        }
      },
      error: () =>{
        this.GoToError();
      }
    }
    );

  }
  GoToError(){
    this.router.navigate(['/error'], { queryParams: { retryUrl: '/home' } });
  }
  GoToInstagram(){
    this.document.location.href = 'https://www.instagram.com/_eleve.eg/profilecard/';
  }

  GetCategoryProducts(id:string){
    this._categoryobserver.updateProductsState(true);
    let idToLower = id.toLowerCase(); 
    this.router.navigate(['/products',idToLower]);
  }

  GetWomensProducts(id: number) {
    this._categoryobserver.updateProductsState(true);
    this.router.navigate(['/products', id]);
  }

  GetSales(){
    this.router.navigate(['/sale']);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
