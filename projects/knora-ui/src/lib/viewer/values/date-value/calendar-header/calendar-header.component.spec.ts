import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';

import { CalendarHeaderComponent } from './calendar-header.component';
import { ACTIVE_CALENDAR, JDNConvertibleCalendarDateAdapter } from 'jdnconvertiblecalendardateadapter';
import { MatSelectModule } from '@angular/material/select';
import { DateAdapter, MatOptionModule } from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCalendar, MatDatepickerContent } from '@angular/material/datepicker';
import { BehaviorSubject } from 'rxjs';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JDNConvertibleCalendarModule } from 'jdnconvertiblecalendar/dist/src/JDNConvertibleCalendar';
import { CalendarDate, CalendarPeriod, JulianCalendarDate } from 'jdnconvertiblecalendar';
import GregorianCalendarDate = JDNConvertibleCalendarModule.GregorianCalendarDate;

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
        MatOptionModule,
        BrowserAnimationsModule
      ],
      declarations: [CalendarHeaderComponent, TestMatCalendarHeaderComponent],
      providers: [
        {
          provide: MatCalendar, useValue: {
            activeDate: new GregorianCalendarDate(new CalendarPeriod(new CalendarDate(2020, 3, 17), new CalendarDate(2020, 3, 17))),
            updateTodaysDate: () => {
            }
          }
        },
        { provide: DateAdapter, useClass: JDNConvertibleCalendarDateAdapter },
        { provide: ACTIVE_CALENDAR, useValue: new BehaviorSubject('Gregorian') },
        {
          provide: MatDatepickerContent, useValue: {
            datepicker: {
              select: () => {
              }
            }
          }
        }
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

  it('should init the selected value and options correctly', fakeAsync(() => {

    expect(component.formControl.value).toEqual('Gregorian');

    // https://github.com/angular/components/blob/941b5a3529727f583b76068835e07e412e69f4f7/src/material/select/select.spec.ts#L1674-L1692
    component.formControl = new FormControl('Gregorian');
    fixture.detectChanges();

    const compDe = fixture.debugElement;

    const selectValueDebugElement = compDe.query(By.css('.mat-select-value'));

    const selectDebugElement = compDe.query(By.css('.mat-select'));

    expect(selectValueDebugElement.nativeElement.textContent).toEqual('Gregorian');

    const trigger = compDe.query(By.css('.mat-select-trigger')).nativeElement;
    trigger.click();
    fixture.detectChanges();
    flush();

    const options: DebugElement[] = selectDebugElement.queryAll(By.css('mat-option'));

    expect(options.length).toEqual(2);

    expect(options[0].nativeElement.innerText).toEqual('Gregorian');

    expect(options[1].nativeElement.innerText).toEqual('Julian');

  }));

  it('should perform a calendar conversion when the selection is changed', () => {

    const dateAdapter = TestBed.inject(DateAdapter) as jasmine.SpyObj<DateAdapter<any>>;

    const dateAdapterSpy = spyOn(dateAdapter, 'convertCalendar').and.callFake(
      (date, calendar) => {
        return new JulianCalendarDate(new CalendarPeriod(new CalendarDate(2020, 3, 4), new CalendarDate(2020, 3, 4)));
      });

    const matCal = TestBed.inject(MatCalendar);

    const matCalendarSpy = spyOn(matCal, 'updateTodaysDate').and.stub();

    const datepickerContent = TestBed.inject(MatDatepickerContent);

    const datepickerContentSpy = spyOn(datepickerContent.datepicker, 'select').and.stub();

    component.formControl.setValue('Julian');

    expect(dateAdapterSpy).toHaveBeenCalledTimes(1);

    expect(dateAdapterSpy).toHaveBeenCalledWith(new GregorianCalendarDate(new CalendarPeriod(new CalendarDate(2020, 3, 17), new CalendarDate(2020, 3, 17))), 'Julian');

    expect(matCal.activeDate).toEqual(new JulianCalendarDate(new CalendarPeriod(new CalendarDate(2020, 3, 4), new CalendarDate(2020, 3, 4))));

    expect(datepickerContentSpy).toHaveBeenCalledTimes(1);

    expect(matCalendarSpy).toHaveBeenCalledTimes(1);

  });

  it('should unsubscribe from value changes subscription when the component is destroyed', () => {

    expect(component.valueChangesSubscription.closed).toEqual(false);

    component.ngOnDestroy();

    expect(component.valueChangesSubscription.closed).toEqual(true);

  });

});
