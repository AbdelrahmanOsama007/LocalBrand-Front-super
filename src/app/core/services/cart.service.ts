import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductInfo } from '../models/productinfo';
import { IOperationResult } from '../interfaces/IOperationResult';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private CartSubject = new BehaviorSubject<boolean>(false);
  cartlist$ = this.CartSubject.asObservable();

  constructor(private _HttpClient:HttpClient) { }

  UpdateHeaderValue(newState: boolean){
    this.CartSubject.next(newState);
   }

  CheckQuantity(productinfo:ProductInfo):Observable<IOperationResult>{
    return this._HttpClient.post<IOperationResult>(`${environment.BaseURL}/api/Cart/CheckStockQuantity`,productinfo);
  }

  GetCartProducts(productsinfo:ProductInfo[]): Observable<IOperationResult>{
    return this._HttpClient.post<IOperationResult>(`${environment.BaseURL}/api/Cart/GetCartProducts`,productsinfo);
  }
}