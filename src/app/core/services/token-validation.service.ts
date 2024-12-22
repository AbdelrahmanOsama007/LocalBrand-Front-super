import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenValidationService {
  constructor() { }
  ValidateToken(){
    const platformId = Inject(PLATFORM_ID);
    let token;
    if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('token');
    }
    if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
    } 
    else {
      return false;
    }
  }
}
