import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenValidationService {
  constructor(@Inject(PLATFORM_ID) private platformId:object) { }

    private HeaderStateSubject = new BehaviorSubject<boolean>(false);
    HeaderState$ = this.HeaderStateSubject.asObservable();
    updateHeaderState(newState: boolean) {
      this.HeaderStateSubject.next(newState);
    }

  ValidateToken(){
    let token;
    if (isPlatformBrowser(this.platformId)) {
    token = localStorage.getItem('token');
    }
    if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        this.updateHeaderState(false);
      }
      this.updateHeaderState(true);
    } catch (error) {
      this.updateHeaderState(false);
    }
    }
    else {
      this.updateHeaderState(false);
    }
  }
}
