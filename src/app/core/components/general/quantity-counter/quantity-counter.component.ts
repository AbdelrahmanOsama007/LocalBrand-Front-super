import { Component, EventEmitter, Input, OnChanges, OnInit, Output, output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { IOperationResult } from '../../../interfaces/IOperationResult';
import { ProductInfo } from '../../../models/productinfo';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-quantity-counter',
  standalone: true,
  imports: [FormsModule ],
  templateUrl: './quantity-counter.component.html',
  styleUrl: './quantity-counter.component.css'
})
export class QuantityCounterComponent implements OnChanges , OnInit {
  last = false
  @Input() product!:ProductInfo;
  loading = false;
  quantity: number = 1;
  @Input() ParentSubject!: Subject<any>
  @Output() outPutQuantity = new EventEmitter<any>();
  constructor(private _cartservice:CartService,private toastr: ToastrService){}
  ngOnInit(): void {
    if(this.ParentSubject){
      this.ParentSubject.subscribe((obj) => {
         ;
        if(this.product.ColorId == obj.ColorId && this.product.SizeId == obj.SizeId && this.product.ProductId == obj.ProductId){
          this.quantity = obj.Quantity;
        }
      })
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && changes['product'].currentValue) {
      this.quantity = this.product.Quantity;
    }
  }
  increment(): void {
    this.loading = true;
    if(this.quantity > 9){
      this.toastr.warning("For larg quantities contact our support");   
      this.last = true;
      this.loading = false;
      return;
    }
    this.product.Quantity = this.quantity;
    this._cartservice.CheckQuantity(this.product).subscribe({
      next: (result:IOperationResult) => {
        if(result.data){
          this.loading = false;
          this.quantity += 1;
          this.sendquantity();
        }
        else{
          this.last = true
          this.loading = false;
          this.toastr.warning("There is only "+this.quantity+" left in the stock");   
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
    
  }
  decrement(): void {
    if (this.quantity > 1) {
      this.quantity -= 1;
      this.sendquantity();
      this.last = false;
    }
  }
  sendquantity(): void {
    let product = new ProductInfo();
    product.Quantity = this.quantity;
    product.ProductId = this.product.ProductId;
    product.SizeId = this.product.SizeId;
    product.ColorId = this.product.ColorId;
    this.outPutQuantity.emit(product);
  }
}