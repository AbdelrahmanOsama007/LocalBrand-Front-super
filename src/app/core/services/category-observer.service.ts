import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryObserverService {

  constructor() { }
  private categoryStateSubject = new BehaviorSubject<boolean>(false);
  
  // Observable that components can subscribe to
  categoryState$ = this.categoryStateSubject.asObservable();

  // Method to update the state
  updateProductsState(newState: boolean) {
    this.categoryStateSubject.next(newState);
  }
}
