import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  if (token) {
    const tokenPayload = decodeToken(token);
    const expirationDate = tokenPayload.exp * 1000;
    const currentTime = Date.now();
    if (currentTime < expirationDate) {
      return true;
    }
  }
  router.navigate(['/admin-login/ahmedeltalkhawy/550e8400-e29b-41d4-a716-446655440000']);
  return false;
};
function decodeToken(token: string): any {
  const payload = token.split('.')[1];
  const decodedPayload = atob(payload);
  return JSON.parse(decodedPayload);
}
