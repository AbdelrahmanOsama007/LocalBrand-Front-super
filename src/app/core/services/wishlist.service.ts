import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IOperationResult } from '../interfaces/IOperationResult';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<boolean>(false);
  wishlist$ = this.wishlistSubject.asObservable();
  
  constructor(private _HttpClient:HttpClient) {}

   UpdateHeaderValue(newState: boolean){
    this.wishlistSubject.next(newState);
   }

  GetWishlistProducts(Ids:number[]):Observable<IOperationResult>{
    return this._HttpClient.post<IOperationResult>(`${environment.BaseURL}/api/Wishlist/GetWishListProducts`,Ids)
  }
}
