import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeInputComponent, DateTime } from './time-input.component';
import { Component, OnInit, ViewChild, DebugElement } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { GregorianCalendarDate, CalendarPeriod, CalendarDate } from 'jdnconvertiblecalendar';
import { MatJDNConvertibleCalendarDateAdapterModule } from 'jdnconvertiblecalendardateadapter';


/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <div [formGroup]="form">
      <mat-form-field>
        <kui-time-input #timeInput [formControlName]="'time'" [readonly]="readonly"></kui-time-input>
      </mat-form-field>
    </div>`
})
class TestHostComponent implements OnInit {

  @ViewChild('timeInput', {static: false}) timeInputComponent: TimeInputComponent;

  form: FormGroup;

  readonly = false;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      time: '2019-08-06T12:00:00Z'
    });

  }
}

describe('TimeInputComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;

  let datetimeInputComponentDe: DebugElement;
  let dateInputDebugElement: DebugElement;
  let dateInputNativeElement;
  let timeInputDebugElement: DebugElement;
  let timeInputNativeElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatJDNConvertibleCalendarDateAdapterModule, BrowserAnimationsModule],
      declarations: [TimeInputComponent, TestHostComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();

    expect(testHostComponent).toBeTruthy();
    expect(testHostComponent.timeInputComponent).toBeTruthy();
    expect(testHostComponent.timeInputComponent.readonly).toBeFalsy();

    const hostCompDe = testHostFixture.debugElement;
    datetimeInputComponentDe = hostCompDe.query(By.directive(TimeInputComponent));

    dateInputDebugElement = datetimeInputComponentDe.query(By.css('input.date'));
    dateInputNativeElement = dateInputDebugElement.nativeElement;

    timeInputDebugElement = datetimeInputComponentDe.query(By.css('input.time'));
    timeInputNativeElement = timeInputDebugElement.nativeElement;

    expect(dateInputNativeElement.readOnly).toBeFalsy;
    expect(timeInputNativeElement.readOnly).toBeFalsy;
  });

  it('should initialize the date correctly', () => {
    expect(dateInputNativeElement.value).toEqual('06-08-2019');
    
    expect(timeInputNativeElement.value).toEqual('14:00');
  });

  it('should propagate changes made by the user', () => {
    testHostComponent.form.controls.time.setValue('1993-10-10T11:00:00Z');

    dateInputNativeElement.dispatchEvent(new Event('input'));

    testHostFixture.detectChanges();

    expect(testHostComponent.form.controls.time).toBeTruthy();
    expect(testHostComponent.form.controls.time.value).toEqual('1993-10-10T11:00:00Z');

    timeInputNativeElement.value = '17:00';

    timeInputNativeElement.dispatchEvent(new Event('input'));

    testHostFixture.detectChanges();

    expect(testHostComponent.form.controls.time).toBeTruthy();
    expect(testHostComponent.form.controls.time.value).toEqual('1993-10-10T16:00:00Z');
  });

  it('should return a timestamp from userInputToTimestamp()', () => {
    const calendarDate = new CalendarDate(1993, 10, 10);
    const gcd = new GregorianCalendarDate(new CalendarPeriod(calendarDate, calendarDate));
    const userInput = new DateTime(gcd, "12:00");

    const timestamp = testHostComponent.timeInputComponent.userInputToTimestamp(userInput);

    expect(timestamp).toEqual('1993-10-10T11:00:00Z');
  });

  it('should return a DateTime from convertTimestampToDateTime()', () => {
    const timestamp = '1993-10-10T11:00:00Z';

    const dateTime = testHostComponent.timeInputComponent.convertTimestampToDateTime(timestamp);

    expect(dateTime.date.toCalendarPeriod().periodStart.year).toEqual(1993);
    expect(dateTime.date.toCalendarPeriod().periodStart.month).toEqual(10);
    expect(dateTime.date.toCalendarPeriod().periodStart.day).toEqual(10);

    expect (dateTime.time).toEqual('12:00');

  });
});