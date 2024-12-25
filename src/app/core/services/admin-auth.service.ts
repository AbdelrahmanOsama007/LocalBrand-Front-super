import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ILogin } from '../interfaces/ILogIn';
import { IEmail } from '../interfaces/IEmail';
import { IChangepassword } from '../interfaces/IChangepassword';
import { IChangePasswordCall } from '../interfaces/IChangePasswordCall';

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

  ChangePassword(model:IChangePasswordCall): Observable<any>{
    return this._HttpClient.post<any>(`${environment.BaseURL}/api/auth/change-password`,model);
  }
  IsAuth(): Observable<any>{
    return this._HttpClient.post<any>(`${environment.BaseURL}/api/Auth/is-auth`,'')
  }
}
