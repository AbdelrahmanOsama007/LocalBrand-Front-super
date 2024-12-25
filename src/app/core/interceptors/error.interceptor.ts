import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
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
      else if(error instanceof HttpErrorResponse && error.status === 401 && error.url && !error.url.includes('/api/is-auth')){
        router.navigate(['/admin-login/ahmedeltalkhawy/550e8400-e29b-41d4-a716-446655440000'])
      }
      return throwError(() => error);
    })
  );
};