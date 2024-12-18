import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingProductsComponent } from './processing-products.component';

describe('ProcessingProductsComponent', () => {
  let component: ProcessingProductsComponent;
  let fixture: ComponentFixture<ProcessingProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessingProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessingProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
