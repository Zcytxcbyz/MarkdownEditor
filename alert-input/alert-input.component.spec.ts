import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertInputComponent } from './alert-input.component';

describe('AlertInputComponent', () => {
  let component: AlertInputComponent;
  let fixture: ComponentFixture<AlertInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
