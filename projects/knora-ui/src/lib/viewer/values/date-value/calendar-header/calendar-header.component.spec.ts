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
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';

@Component({
  selector: `mat-calendar-header`,
  template: ``
})
class TestMatCalendarHeaderComponent {

}

describe('CalendarHeaderComponent', () => {
  let component: CalendarHeaderComponent<JDNConvertibleCalendarDateAdapter>;
  let fixture: ComponentFixture<CalendarHeaderComponent<JDNConvertibleCalendarDateAdapter>>;
  let loader: HarnessLoader;
  let rootLoader: HarnessLoader;

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
    loader = TestbedHarnessEnvironment.loader(fixture);
    rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init the selected value and options correctly', async () => {

      const select = await loader.getHarness(MatSelectHarness);
      const initVal = await select.getValueText();

      expect(initVal).toEqual('Gregorian');

      await select.open();

      const options = await select.getOptions();

      expect(options.length).toEqual(2);

      const option1 = await options[0].getText();

      expect(option1).toEqual('Gregorian');

      const option2 = await options[1].getText()

      expect(option2).toEqual('Julian');

  });

  it('should perform a calendar conversion when the selection is changed', () => {

    const dateAdapter = TestBed.inject(DateAdapter);

    const dateAdapterSpy = spyOn(dateAdapter as JDNConvertibleCalendarDateAdapter, 'convertCalendar').and.callFake(
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
