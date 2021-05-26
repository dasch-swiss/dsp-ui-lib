import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateInputTextComponent } from './date-input-text.component';

describe('DateInputTextComponent', () => {
  let component: DateInputTextComponent;
  let fixture: ComponentFixture<DateInputTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateInputTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateInputTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
