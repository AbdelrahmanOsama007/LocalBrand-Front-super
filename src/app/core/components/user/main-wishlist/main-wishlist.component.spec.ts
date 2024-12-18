import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainWishlistComponent } from './main-wishlist.component';

describe('MainWishlistComponent', () => {
  let component: MainWishlistComponent;
  let fixture: ComponentFixture<MainWishlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainWishlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
