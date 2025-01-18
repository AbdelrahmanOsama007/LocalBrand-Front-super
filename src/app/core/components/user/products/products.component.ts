import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { IOperationResult } from '../../../interfaces/IOperationResult';
import { ICategory } from '../../../interfaces/ICategory';
import { ProductService } from '../../../services/product.service';
import { IProduct } from '../../../interfaces/IProduct';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '../../general/card/card.component';
import { CategoryObserverService } from '../../../services/category-observer.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgxSkeletonLoaderModule,CardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit, OnDestroy {
  isLoading = true;
  categories: ICategory[] = [];
  CurrentCategory!: ICategory;
  CategoryName: string = "";
  products:IProduct[] = [];
  subscription : Subscription[] = [];
  constructor(private _catservice:CategoryService, 
    private _productservice:ProductService, 
    private activatedroute:ActivatedRoute, 
    private _categoryobserver: CategoryObserverService, 
    private router: Router){
    }
  
  ngOnInit(): void {
      this.GetCategoryProducts();
    }
  GetCategoryProducts(){
    this.subscription.push(
      this.activatedroute.paramMap.subscribe((p)=>{
        const snapid = p.get('id');
        let id = 0;

        switch (snapid?.toLowerCase()) {
          case 'men':
              id = 1;
              break;
          case 'women':
              id = 2;
              break;
          case 'unisex':
              id = 3;
              break;
          case 'accessories':
              id = 4;
              break;
          case 'contact':
              id = 5;
              break;
          case 'men&women':
              id = 10;
              break;
          default:
              id = 0; 
      }        if(id != 0){
          this.GetProductsByCatId(id);
          this._catservice.GetCategoryName(id).subscribe({
            next: (result:IOperationResult) => {
              if(result.success){
                this.CurrentCategory = result.data as ICategory;
                this.CategoryName = this.CurrentCategory.categoryName;
                this.isLoading = false;
              }
            }
          })
        }
      })
    )
  }

  GoToHome(){
    this.router.navigate(['/home'])
  }

  GoToError(){
    this.router.navigate(['/error'], { queryParams: { retryUrl: '/home' } });
  }

  GetProductsByCatId(id: number) {
    this._productservice.GetProductsByCatId(id).subscribe({
      next: (result: IOperationResult) => {
        if (result.success) {
          this.products = result.data as IProduct[];
        }
      },
      error: () => {
        this.GoToError();
      },
    });
  }

  GetProductsBySubCatId(id:number){
    this.subscription.push(
      this._productservice.GetProductBySubCatId(id).subscribe({
        next: (result:IOperationResult) => {
          if(result.success){
            this.products = result.data as IProduct[];
          }
        },
        error: () => {
          this.GoToError();
        }
      })
    )
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.forEach((s) => s.unsubscribe());
    }
  }
}
