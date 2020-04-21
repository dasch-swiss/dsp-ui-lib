import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DateInputComponent} from './date-input.component';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {KnoraDate, KnoraPeriod} from '@knora/api';
import {JDNDatepickerDirective} from '../../jdn-datepicker-directive/jdndatepicker.directive';
import {MatFormFieldModule} from '@angular/material/form-field';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatJDNConvertibleCalendarDateAdapterModule} from 'jdnconvertiblecalendardateadapter';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CalendarDate, GregorianCalendarDate, CalendarPeriod, JulianCalendarDate} from 'jdnconvertiblecalendar';
import {By} from '@angular/platform-browser';

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <div [formGroup]="form">
      <mat-form-field>
        <kui-date-input #dateInput [formControlName]="'date'" [readonly]="readonly"></kui-date-input>
      </mat-form-field>
    </div>`
})
class TestHostComponent implements OnInit {

  @ViewChild('dateInput') dateInputComponent: DateInputComponent;

  form: FormGroup;

  readonly = false;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      date: [new KnoraDate('JULIAN', 'CE', 2018, 5, 19)]
    });

  }
}

describe('DateInputComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatJDNConvertibleCalendarDateAdapterModule,
        BrowserAnimationsModule
      ],
      declarations: [DateInputComponent, TestHostComponent, JDNDatepickerDirective]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();

    expect(testHostComponent).toBeTruthy();
  });

  it('should initialize a date correctly', () => {

    expect(testHostComponent.dateInputComponent.value instanceof KnoraDate).toBe(true);
    expect(testHostComponent.dateInputComponent.value)
      .toEqual(new KnoraDate('JULIAN', 'CE', 2018, 5, 19));

    expect(testHostComponent.dateInputComponent.startDateControl.value)
      .toEqual(new JulianCalendarDate(new CalendarPeriod(new CalendarDate(2018, 5, 19), new CalendarDate(2018, 5, 19))));

    expect(testHostComponent.dateInputComponent.isPeriodControl.value).toBe(false);

    expect(testHostComponent.dateInputComponent.endDateControl.value).toBe(null);

    expect(testHostComponent.dateInputComponent.form.valid).toBe(true);

  });

  it('should initialize a period correctly', () => {

    testHostComponent.form.controls.date.setValue(new KnoraPeriod(new KnoraDate('JULIAN', 'CE', 2018, 5, 19), new KnoraDate('JULIAN', 'CE', 2019, 5, 19)));

    expect(testHostComponent.dateInputComponent.value instanceof KnoraPeriod).toBe(true);
    expect(testHostComponent.dateInputComponent.value)
      .toEqual(new KnoraPeriod(new KnoraDate('JULIAN', 'CE', 2018, 5, 19), new KnoraDate('JULIAN', 'CE', 2019, 5, 19)));

    expect(testHostComponent.dateInputComponent.startDateControl.value)
      .toEqual(new JulianCalendarDate(new CalendarPeriod(new CalendarDate(2018, 5, 19), new CalendarDate(2018, 5, 19))));

    expect(testHostComponent.dateInputComponent.isPeriodControl.value).toBe(true);

    expect(testHostComponent.dateInputComponent.endDateControl.value)
      .toEqual(new JulianCalendarDate(new CalendarPeriod(new CalendarDate(2019, 5, 19), new CalendarDate(2019, 5, 19))));

    expect(testHostComponent.dateInputComponent.form.valid).toBe(true);

  });

  it('should propagate changes made by the user for a single date', () => {

    testHostComponent.dateInputComponent.form.controls.dateStart.setValue(new JulianCalendarDate(new CalendarPeriod(new CalendarDate(2019, 5, 19), new CalendarDate(2019, 5, 19))));

    testHostComponent.dateInputComponent._handleInput();

    expect(testHostComponent.dateInputComponent.form.valid).toBe(true);

    expect(testHostComponent.form.controls.date.value).toEqual(new KnoraDate('JULIAN', 'CE', 2019, 5, 19));
  });

  it('should propagate changes made by the user for a period', () => {

    testHostComponent.dateInputComponent.form.controls.dateStart.setValue(new JulianCalendarDate(new CalendarPeriod(new CalendarDate(2019, 5, 19), new CalendarDate(2019, 5, 19))));

    testHostComponent.dateInputComponent.form.controls.isPeriod.setValue(true);

    testHostComponent.dateInputComponent.form.controls.dateEnd.setValue(new JulianCalendarDate(new CalendarPeriod(new CalendarDate(2020, 5, 19), new CalendarDate(2020, 5, 19))));

    testHostComponent.dateInputComponent._handleInput();

    expect(testHostComponent.dateInputComponent.form.valid).toBe(true);

    expect(testHostComponent.form.controls.date.value).toEqual(new KnoraPeriod(new KnoraDate('JULIAN', 'CE', 2019, 5, 19), new KnoraDate('JULIAN', 'CE', 2020, 5, 19)));
  });

  it('should return "null" for an invalid user input (start date greater than end date)', () => {

    testHostComponent.dateInputComponent.form.controls.dateStart.setValue(new JulianCalendarDate(new CalendarPeriod(new CalendarDate(2021, 5, 19), new CalendarDate(2021, 5, 19))));

    testHostComponent.dateInputComponent.form.controls.isPeriod.setValue(true);

    testHostComponent.dateInputComponent.form.controls.dateEnd.setValue(new JulianCalendarDate(new CalendarPeriod(new CalendarDate(2020, 5, 19), new CalendarDate(2020, 5, 19))));

    testHostComponent.dateInputComponent._handleInput();

    expect(testHostComponent.dateInputComponent.form.valid).toBe(false);

    expect(testHostComponent.dateInputComponent.value).toEqual(null);

  });

  it('should return "null" for an invalid user input (start date and end date have different calendars)', () => {

    testHostComponent.dateInputComponent.form.controls.dateStart.setValue(new JulianCalendarDate(new CalendarPeriod(new CalendarDate(2021, 5, 19), new CalendarDate(2021, 5, 19))));

    testHostComponent.dateInputComponent.form.controls.isPeriod.setValue(true);

    testHostComponent.dateInputComponent.form.controls.dateEnd.setValue(new GregorianCalendarDate(new CalendarPeriod(new CalendarDate(2022, 5, 19), new CalendarDate(2022, 5, 19))));

    testHostComponent.dateInputComponent._handleInput();

    expect(testHostComponent.dateInputComponent.form.valid).toBe(false);

    expect(testHostComponent.dateInputComponent.value).toEqual(null);

  });

  it('should return "null" for an invalid user input (start date is "null")', () => {

    testHostComponent.dateInputComponent.form.controls.dateStart.setValue(null);

    testHostComponent.dateInputComponent.form.controls.isPeriod.setValue(true);

    testHostComponent.dateInputComponent.form.controls.dateEnd.setValue(new JulianCalendarDate(new CalendarPeriod(new CalendarDate(2020, 5, 19), new CalendarDate(2020, 5, 19))));

    expect(testHostComponent.dateInputComponent.form.valid).toBe(false);

    expect(testHostComponent.dateInputComponent.value).toEqual(null);

  });

  it('should initialize the date with an empty value', () => {

    testHostComponent.form.controls.date.setValue(null);

    expect(testHostComponent.dateInputComponent.form.controls.dateStart.value).toBe(null);
    expect(testHostComponent.dateInputComponent.form.controls.isPeriod.value).toBe(false);
    expect(testHostComponent.dateInputComponent.form.controls.dateEnd.value).toBe(null);

    expect(testHostComponent.dateInputComponent.form.valid).toBe(false);

  });

  it('should show the toggle when not in readonly mode', () => {

    expect(testHostComponent.dateInputComponent.readonly).toBe(false);

    testHostComponent.dateInputComponent.form.controls.isPeriod.setValue(true);

    testHostFixture.detectChanges();

    const hostCompDe = testHostFixture.debugElement;
    const dateInputComponentDe = hostCompDe.query(By.directive(DateInputComponent));

    const startDateToggle = dateInputComponentDe.query(By.css('.start mat-datepicker-toggle'));

    expect(startDateToggle).not.toBe(null);

    const endDateToggle = dateInputComponentDe.query(By.css('.end mat-datepicker-toggle'));

    expect(endDateToggle).not.toBe(null);
  });

  it('should not show the toggle when in readonly mode', () => {

    testHostComponent.readonly = true;

    testHostComponent.dateInputComponent.form.controls.isPeriod.setValue(true);

    testHostFixture.detectChanges();

    expect(testHostComponent.dateInputComponent.readonly).toBe(true);

    const hostCompDe = testHostFixture.debugElement;
    const dateInputComponentDe = hostCompDe.query(By.directive(DateInputComponent));

    const startDateToggle = dateInputComponentDe.query(By.css('.start mat-datepicker-toggle'));

    expect(startDateToggle).toBe(null);

    const endDateToggle = dateInputComponentDe.query(By.css('.end mat-datepicker-toggle'));

    expect(endDateToggle).toBe(null);

  });

  it('should show the calendar of a date', () => {

    const hostCompDe = testHostFixture.debugElement;
    const dateInputComponentDe = hostCompDe.query(By.directive(DateInputComponent));

    const startDateCalendar = dateInputComponentDe.query(By.css('.start span.calendar'));

    expect(startDateCalendar).not.toBe(null);

  });

});
