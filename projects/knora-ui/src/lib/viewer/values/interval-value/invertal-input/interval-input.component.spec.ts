import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalInputComponent } from './interval-input.component';

describe('InvertalInputComponent', () => {
  let component: IntervalInputComponent;
  let fixture: ComponentFixture<IntervalInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntervalInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntervalInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
