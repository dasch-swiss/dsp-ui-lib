import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTime, TimeInputComponent } from './time-input.component';
import { KnoraDate } from '@knora/api';
import { Component, OnInit, ViewChild, DebugElement } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { GregorianCalendarDate, CalendarPeriod, CalendarDate, JulianCalendarDate, JDNConvertibleCalendar } from 'jdnconvertiblecalendar';


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
      time: [new DateTime(new KnoraDate("Gregorian", "AD", 1993, 10, 10), "11:45")]
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
      imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, BrowserAnimationsModule],
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

  it('should initialize the DateTime correctly', () => {

    const knoraDate = testHostComponent.timeInputComponent.value.date as unknown as GregorianCalendarDate;
    expect(knoraDate.toCalendarPeriod().periodStart.year).toEqual(1993);
    expect(knoraDate.toCalendarPeriod().periodStart.month).toEqual(10);
    expect(knoraDate.toCalendarPeriod().periodStart.day).toEqual(10);

    expect(timeInputNativeElement.value).toEqual('11:45');

  });

  it('should propagate changes made by the user', () => {
    
    testHostComponent.form.setValue({time: new DateTime(new KnoraDate("Gregorian", "AD", 1970, 1, 2), "11:53")});

    const knoraDate = testHostComponent.timeInputComponent.value.date as unknown as GregorianCalendarDate;
    expect(knoraDate.toCalendarPeriod().periodStart.year).toEqual(1970);
    expect(knoraDate.toCalendarPeriod().periodStart.month).toEqual(1);
    expect(knoraDate.toCalendarPeriod().periodStart.day).toEqual(2);

    expect(testHostComponent.form.controls.time.value).toBeTruthy();
    expect(testHostComponent.form.controls.time.value.time).toEqual('11:53');

  });
});