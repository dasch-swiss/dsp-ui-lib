import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarHeaderComponent } from './calendar-header.component';
import {JDNConvertibleCalendarDateAdapter} from "jdnconvertiblecalendardateadapter";

describe('CalendarHeaderComponent', () => {
  let component: CalendarHeaderComponent<JDNConvertibleCalendarDateAdapter>;
  let fixture: ComponentFixture<CalendarHeaderComponent<JDNConvertibleCalendarDateAdapter>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
