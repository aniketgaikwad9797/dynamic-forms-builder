import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsFillComponent } from './forms-fill.component';

describe('FormsFillComponent', () => {
  let component: FormsFillComponent;
  let fixture: ComponentFixture<FormsFillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormsFillComponent]
    });
    fixture = TestBed.createComponent(FormsFillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
