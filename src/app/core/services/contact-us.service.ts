import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOperationResult } from '../interfaces/IOperationResult';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment.development';
import { IUserEmail } from '../interfaces/IUserEmail';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  constructor(private _HttpClient:HttpClient) { }
  ContactUs(object:IUserEmail):Observable<IOperationResult>{
    return this._HttpClient.post<IOperationResult>(`${environment.BaseURL}/api/CantactUs/ContactUs`,object);
  }
}