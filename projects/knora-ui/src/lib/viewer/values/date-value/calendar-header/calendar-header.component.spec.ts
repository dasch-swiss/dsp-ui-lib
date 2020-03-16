import {async, ComponentFixture, fakeAsync, flush, TestBed} from '@angular/core/testing';

import {CalendarHeaderComponent} from './calendar-header.component';
import {ACTIVE_CALENDAR, JDNConvertibleCalendarDateAdapter} from "jdnconvertiblecalendardateadapter";
import {MatSelectModule} from "@angular/material/select";
import {DateAdapter, MatOptionModule} from "@angular/material/core";
import {ReactiveFormsModule} from "@angular/forms";
import {MatCalendar, MatDatepickerContent} from "@angular/material/datepicker";
import {BehaviorSubject} from "rxjs";
import {Component} from "@angular/core";
import {By} from "@angular/platform-browser";

@Component({
  selector: `mat-calendar-header`,
  template: ``
})
class TestMatCalendarHeaderComponent {

}

describe('CalendarHeaderComponent', () => {
  let component: CalendarHeaderComponent<JDNConvertibleCalendarDateAdapter>;
  let fixture: ComponentFixture<CalendarHeaderComponent<JDNConvertibleCalendarDateAdapter>>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSelectModule,
        MatOptionModule
      ],
      declarations: [CalendarHeaderComponent, TestMatCalendarHeaderComponent],
      providers: [
        {provide: MatCalendar, useValue: {}},
        {provide: DateAdapter, useValue: {}},
        {provide: ACTIVE_CALENDAR, useValue: new BehaviorSubject('Gregorian')},
        {provide: MatDatepickerContent, useValue: {}}
      ]
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

  it('should set Gregorian as the active calendar in the selection', fakeAsync(() => {

    // https://github.com/angular/components/blob/941b5a3529727f583b76068835e07e412e69f4f7/src/material/select/select.spec.ts#L1674-L1692
    component.formControl.setValue('Gregorian');
    fixture.detectChanges();
    flush();

    expect(component.formControl.value).toEqual('Gregorian');

    const compDe = fixture.debugElement;

    const selectDebugElement = compDe.query(By.css('.mat-select-value'));

    console.log(selectDebugElement);

  }));

});
