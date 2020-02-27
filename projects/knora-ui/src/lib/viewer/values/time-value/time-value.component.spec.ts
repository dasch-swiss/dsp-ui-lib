import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeValueComponent } from './time-value.component';
import { Component, OnInit, ViewChild, DebugElement } from '@angular/core';
import { TimeInputComponent, DateTime } from './time-input/time-input.component';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { KnoraDate } from '@knora/api';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <div [formGroup]="form">
      <mat-form-field>
        <kui-time-input #intervalInput [formControlName]="'time'" [readonly]="readonly"></kui-time-input>
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
      interval: [new DateTime(new KnoraDate("Gregorian", "AD", 1993, 10, 10), "19:11")]
    });

  }
}

describe('TimeValueComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;

  let timeInputComponentDe: DebugElement;
  let dateInputDebugElement: DebugElement;
  let dateInputNativeElement;
  let timeInputDebugElement: DebugElement;
  let timeInputNativeElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule],
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
    timeInputComponentDe = hostCompDe.query(By.directive(TimeInputComponent));
    dateInputDebugElement = timeInputComponentDe.query(By.css('input.start'));
    dateInputNativeElement = dateInputDebugElement.nativeElement;
    timeInputDebugElement = timeInputComponentDe.query(By.css('input.end'));
    timeInputNativeElement = timeInputDebugElement.nativeElement;

    expect(dateInputNativeElement.readOnly).toBe(false);
    expect(timeInputNativeElement.readOnly).toBe(false);
  });

  it('should initialize the timestamp correctly', () => {

    expect(dateInputNativeElement.value).toEqual('1');
    expect(timeInputNativeElement.value).toEqual('2');

  });
});
