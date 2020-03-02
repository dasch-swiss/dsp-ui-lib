import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTime, TimeInputComponent } from './time-input.component';
import { KnoraDate } from '@knora/api';
import { Component, OnInit, ViewChild, DebugElement } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker'


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

    console.log('form.time: ',this.form.get('time').value);

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
    console.log('dateInputDebugElement: ', dateInputDebugElement);
    dateInputNativeElement = dateInputDebugElement.nativeElement;
    //console.log('dateInputNativeElement: ', dateInputNativeElement);

    timeInputDebugElement = datetimeInputComponentDe.query(By.css('input.time'));
    //console.log('timeInputDebugElement: ', timeInputDebugElement);
    timeInputNativeElement = timeInputDebugElement.nativeElement;

    expect(dateInputNativeElement.readOnly).toBeFalsy;
    expect(timeInputNativeElement.readOnly).toBeFalsy;
  });

  it('should initialize the DateTime correctly', () => {

    //dateInputNativeElement.value = "10-10-1993";

    //console.log('dateInputNativeElement.value: ', dateInputNativeElement.value);
    //console.log('timeInputNativeElement.value: ', timeInputNativeElement.value);
    //expect(dateInputNativeElement.value).toEqual("10-10-1993");
    expect(timeInputNativeElement.value).toEqual('11:45');

  });

  it('should propagate changes made by the user', () => {

    dateInputNativeElement.value = '11-12-1993';
    dateInputNativeElement.dispatchEvent(new Event('dateChange'));

    testHostFixture.detectChanges();

    expect(testHostComponent.form.controls.time).toBeTruthy();
    // expect(testHostComponent.form.controls.time.value.date.year).toEqual(1993);
    // expect(testHostComponent.form.controls.time.value.date.month).toEqual(12);
    // expect(testHostComponent.form.controls.time.value.date.day).toEqual(11);
    expect(testHostComponent.form.controls.time.value.time).toEqual('11:45');

    timeInputNativeElement.value = '10:35';
    timeInputNativeElement.dispatchEvent(new Event('input'));

    testHostFixture.detectChanges();

    expect(testHostComponent.form.controls.time.value).toBeTruthy();
    expect(testHostComponent.form.controls.time.value.time).toEqual('10:35');

  });
});