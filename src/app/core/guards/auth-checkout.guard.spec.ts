import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authCheckoutGuard } from './auth-checkout.guard';

describe('authCheckoutGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authCheckoutGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
