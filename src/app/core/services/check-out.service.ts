import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IOperationResult } from '../interfaces/IOperationResult';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CheckOutService {

  constructor(private _HttpClient:HttpClient) {}
  ApplyOrder(order:any): Observable<IOperationResult>{
    return this._HttpClient.post<IOperationResult>(`${environment.BaseURL}/api/Order/AddNewOrder`,order);
  }
}