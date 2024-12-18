import { TestBed } from '@angular/core/testing';

import { CheckoutAuthService } from './checkout-auth.service';

describe('CheckoutAuthService', () => {
  let service: CheckoutAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
