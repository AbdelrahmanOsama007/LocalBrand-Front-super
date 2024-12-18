import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IProduct } from '../../../interfaces/IProduct';
import { CardComponent } from '../../general/card/card.component';
import { ProductService } from '../../../services/product.service';
import { IOperationResult } from '../../../interfaces/IOperationResult';
import { Subscription } from 'rxjs/internal/Subscription';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CardComponent,NgxSkeletonLoaderModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit , OnDestroy {
 constructor(private _productservice:ProductService,private router: Router){}
 products:IProduct[] = [];
 isLoading = true;
 subscription: Subscription[] = [];
 @ViewChild('SearchInput') inputElement!: ElementRef;
 ngOnInit(): void {
  setTimeout(() => {
      this.inputElement.nativeElement.focus();
    },0);
  this.subscription.push(
    this._productservice.GetAllProducts().subscribe({
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
  this.router.navigate(['/error'], { queryParams: { retryUrl: '/home' } });
}

SearchProduct(searchtext:Event){
  this.isLoading = true;
  this.subscription.push(
    this._productservice.GetAllProducts((searchtext.target as HTMLInputElement).value).subscribe({
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

ngOnDestroy(): void {
  if(this.subscription){
    this.subscription.forEach((s) => s.unsubscribe());
  }
}

}
