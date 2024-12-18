import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrder } from '../interfaces/IOrderAdmin';
import { environment } from '../../../environments/environment.development';
import { IOperationResult } from '../interfaces/IOperationResult';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class OrderadminService {
  constructor(private _HttpClient: HttpClient) {}

  // Create a new order
  AddOrder(order: IOrder): Observable<IOperationResult> {
    return this._HttpClient.post<IOperationResult>(
      `${environment.BaseURL}/api/Order/AddNewOrder`,
      order
    );
  }

  // Update an existing order
  UpdateOrder(order: IOrder): Observable<IOperationResult> {
    return this._HttpClient.post<IOperationResult>(
      `${environment.BaseURL}/api/Order/UpdateOrder`,
      order  
    );
  }

  // Delete an order by ID
  DeleteOrder(id: number): Observable<IOperationResult> {
    return this._HttpClient.post<IOperationResult>(
      `${environment.BaseURL}/api/Order/DeleteOrder`,
      id
    )
  }

  // Get all orders
  GetAllOrders(): Observable<IOperationResult> {
    return this._HttpClient.post<IOperationResult>(
      `${environment.BaseURL}/api/Order/GetAllOrders`,
      ' '
    );
  }
  getOrderById(orderId: number): Observable<IOperationResult> {
    return this._HttpClient.post<IOperationResult>(
      `${environment.BaseURL}/api/Order//GetOrderById`,
      {
        orderid: orderId,
      }
    );
  }
}
