import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { IProduct } from '../../../interfaces/IProduct';
import { Subscription } from 'rxjs/internal/Subscription';
import { IOperationResult } from '../../../interfaces/IOperationResult';
import { CardComponent } from '../../general/card/card.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-sale-products',
  standalone: true,
  imports: [CardComponent,NgxSkeletonLoaderModule],
  templateUrl: './sale-products.component.html',
  styleUrl: './sale-products.component.css'
})
export class SaleProductsComponent implements OnInit , OnDestroy {
  constructor(private _productservice:ProductService,private router: Router){}
  products:IProduct[] = [];
  isLoading = true;
  subscription: Subscription[] = [];

  ngOnInit(): void {
    this.subscription.push(
      this._productservice.GetSaleProducts().subscribe({
      next: (result:IOperationResult) => {
        if(result.success){
          this.products = result.data as IProduct[];
          this.isLoading = false;
        }
      },
      error: () => {
        this.GoToError();
      }
    }))
  }

  GoToError(){
    this.router.navigate(['/error'], { queryParams: { retryUrl: '/sale' } });
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.forEach((s) => s.unsubscribe());
    }
  }
}
