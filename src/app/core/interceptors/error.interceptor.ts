import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const errorUrl = '/error';
  return next(req).pipe(
    catchError((error) => {
      const currentUrl = router.url;
      if (error && error.status != 401 && currentUrl !== errorUrl) {
        router.navigate([errorUrl], { queryParams: { retryUrl: currentUrl } });
      }
      return throwError(() => error);
    })
  );
};
