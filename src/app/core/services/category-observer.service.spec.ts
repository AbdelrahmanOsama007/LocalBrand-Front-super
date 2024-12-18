import { TestBed } from '@angular/core/testing';

import { CategoryObserverService } from './category-observer.service';

describe('CategoryObserverService', () => {
  let service: CategoryObserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryObserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
