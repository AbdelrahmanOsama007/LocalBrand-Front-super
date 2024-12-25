import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { AdminAuthService } from './admin-auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenValidationService {
  constructor(@Inject(PLATFORM_ID) private platformId:object, private _adminAuth: AdminAuthService) { }

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
      this._adminAuth.IsAuth().subscribe({
        next: () =>{
          this.updateHeaderState(true);
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse && error.status === 401 && error.url && error.url.includes('/api/is-auth')) {
              this.updateHeaderState(false);
          }
        }
      })
    } catch (error) {
      this.updateHeaderState(false);
    }
    }
    else {
      this.updateHeaderState(false);
    }
  }
}
