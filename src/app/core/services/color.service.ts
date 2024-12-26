import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IColorPagination } from '../interfaces/IColorPagination';
import { Observable } from 'rxjs';
import { IGridOperationResult } from '../interfaces/IGridOperationResult';
import { environment } from '../../../environments/environment.development';
import { IOperationResult } from '../interfaces/IOperationResult';
import { IColor } from '../interfaces/IProductadmin';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  constructor(private _HttpClient:HttpClient) {}
  GetColorGrid(object:IColorPagination):Observable<IGridOperationResult>{
    return this._HttpClient.post<IGridOperationResult>(`${environment.BaseURL}/api/Color/GetColorGrid`,object);
  }
  UpdateColor(object:any):Observable<IOperationResult>{
    return this._HttpClient.post<IOperationResult>(`${environment.BaseURL}/api/Color/UpdateColor`,object);
  }
  GetColorById(id:number):Observable<IOperationResult>{
    return this._HttpClient.post<IOperationResult>(`${environment.BaseURL}/api/Color/GetColorById`,id);
  }
  AddColor(object:IColor):Observable<IOperationResult>{
    return this._HttpClient.post<IOperationResult>(`${environment.BaseURL}/api/Color/AddColor`,object);
  }
}
