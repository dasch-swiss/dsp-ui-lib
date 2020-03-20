import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DateInputComponent} from './date-input.component';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {KnoraDate} from '@knora/api';
import {JDNDatepickerDirective} from '../../jdn-datepicker-directive/jdndatepicker.directive';
import {MatFormFieldModule} from '@angular/material/form-field';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatJDNConvertibleCalendarDateAdapterModule} from 'jdnconvertiblecalendardateadapter';

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

  @ViewChild('dateInput', {static: false}) dateInputComponent: DateInputComponent;

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
  });

  it('should create', () => {
    expect(testHostComponent).toBeTruthy();
    // console.log(testHostComponent.dateInputComponent);
  });
});
