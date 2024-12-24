import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ILogin } from '../interfaces/ILogIn';
import { IEmail } from '../interfaces/IEmail';
import { IChangepassword } from '../interfaces/IChangepassword';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  constructor(private _HttpClient:HttpClient) { }

  Login(loginmodel:ILogin): Observable<any>{
    return this._HttpClient.post<any>(`${environment.BaseURL}/api/auth/login`,loginmodel);
  }

  ForgetPassword(email:IEmail): Observable<any>{
    return this._HttpClient.post<any>(`${environment.BaseURL}/api/auth/forgot-password`,email);
  }

  ChangePassword(model:IChangepassword): Observable<any>{
    return this._HttpClient.post<any>(`${environment.BaseURL}/api/auth/change-password`,model);
  }
}
