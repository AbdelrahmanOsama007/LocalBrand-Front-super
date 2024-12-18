import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CheckoutAuthService } from '../services/checkout-auth.service';

export const authCheckoutGuard: CanActivateFn = (route, state) => {
  const checkoutAuthService = inject(CheckoutAuthService);
  const router = inject(Router);

  if (checkoutAuthService.isNavigationAllowed()) {
    return true;
  } else {
    router.navigate(['/cart']);
    return false;
  }
};