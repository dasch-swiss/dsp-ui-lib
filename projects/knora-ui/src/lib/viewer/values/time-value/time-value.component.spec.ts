import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeValueComponent } from './time-value.component';

describe('TimeValueComponent', () => {
  let component: TimeValueComponent;
  let fixture: ComponentFixture<TimeValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
