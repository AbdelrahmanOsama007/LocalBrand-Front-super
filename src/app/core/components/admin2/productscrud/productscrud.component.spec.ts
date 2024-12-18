import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductscrudComponent } from './productscrud.component';

describe('ProductscrudComponent', () => {
  let component: ProductscrudComponent;
  let fixture: ComponentFixture<ProductscrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductscrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductscrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
