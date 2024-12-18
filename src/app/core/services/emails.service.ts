import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOperationResult } from '../interfaces/IOperationResult';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs/internal/Observable';
import { IEmailPagination } from '../interfaces/IEmailPagination';
import { IEditEmailStatus } from '../interfaces/IEditEmailStatus';

@Injectable({
  providedIn: 'root'
})
export class EmailsService {

  constructor(private _HttpClient:HttpClient) {}

  GetAllEmails(object:IEmailPagination):Observable<IOperationResult>{
    return this._HttpClient.post<IOperationResult>(`${environment.BaseURL}/api/CantactUs/GetAllEmails`,object);
  }

  EditEmailStatus(object:IEditEmailStatus):Observable<IOperationResult>{
    return this._HttpClient.post<IOperationResult>(`${environment.BaseURL}/api/CantactUs/EditEmailStatus`,object);
  }
}
