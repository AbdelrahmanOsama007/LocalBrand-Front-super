import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { Inject, PLATFORM_ID } from '@angular/core';
import { debug } from 'console';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = Inject(PLATFORM_ID);
    let token;
    if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('token');
    }
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(authReq);
    } else {
      return next(req);
    }
  };
