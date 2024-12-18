import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckoutAuthService {
  private navigationAllowed = false;
  allowNavigation(): void {
    this.navigationAllowed = true;
  }
  isNavigationAllowed(): boolean {
    const allowed = this.navigationAllowed;
    this.navigationAllowed = false;
    return allowed;
  }
}
