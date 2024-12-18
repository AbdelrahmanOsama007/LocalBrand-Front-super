import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatcrudComponent } from './catcrud.component';

describe('CatcrudComponent', () => {
  let component: CatcrudComponent;
  let fixture: ComponentFixture<CatcrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatcrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatcrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
