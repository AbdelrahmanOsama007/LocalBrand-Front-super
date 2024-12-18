import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { Inject, PLATFORM_ID } from '@angular/core';
import { finalize } from 'rxjs';

export const httpLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = Inject(PLATFORM_ID);
  if (isPlatformBrowser(platformId)) {
    document.body.classList.add('loading');
  }
  return next(req).pipe(
    finalize(() => {
      if (isPlatformBrowser(platformId)) {
        document.body.classList.remove('loading');
      }
    })
  );
};
