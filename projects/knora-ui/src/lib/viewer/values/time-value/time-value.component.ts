import { Component, OnInit, OnChanges, OnDestroy, ViewChild, Input, Inject, SimpleChanges, LOCALE_ID } from '@angular/core';
import { TimeInputComponent, DateTime } from './time-input/time-input.component';
import { ReadTimeValue, CreateTimeValue, UpdateTimeValue, KnoraDate } from '@knora/api';
import { BaseValueComponent } from '..';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IntervalErrorStateMatcher } from '../interval-value/interval-value.component';
import { stringify } from 'querystring';
import { DatePipe, formatDate } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material';
import { format } from 'url';

@Component({
  selector: 'kui-time-value',
  templateUrl: './time-value.component.html',
  styleUrls: ['./time-value.component.scss']
})
export class TimeValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('timeInput', {static: false}) timeInputComponent: TimeInputComponent;

  @Input() displayValue?: ReadTimeValue;

  valueFormControl: FormControl;
  commentFormControl: FormControl;
  date: string;
  time: string;
  knoraDate: KnoraDate;

  form: FormGroup;

  valueChangesSubscription: Subscription;

  customValidators = [];

  matcher = new IntervalErrorStateMatcher();

  constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    super();
  }

  getInitValue(): DateTime | null {
    if (this.displayValue !== undefined) {
      const datePipe = new DatePipe('en-US');
      this.date = datePipe.transform(this.displayValue.time, "d.M.y");
      this.time = datePipe.transform(this.displayValue.time, "HH:mm");
      
      this.knoraDate = new KnoraDate("Gregorian",
                                     "AD",
                                     Number(datePipe.transform(this.displayValue.time, "y")),
                                     Number(datePipe.transform(this.displayValue.time, "M")),
                                     Number(datePipe.transform(this.displayValue.time, "d")));

      return new DateTime(this.knoraDate, this.time);
    } else {
      return null;
    }
  }

  ngOnInit() {
    // initialize form control elements
    this.valueFormControl = new FormControl(null);

    this.commentFormControl = new FormControl(null);

    // subscribe to any change on the comment and recheck validity
    this.valueChangesSubscription = this.commentFormControl.valueChanges.subscribe(
      data => {
        this.valueFormControl.updateValueAndValidity();
      }
    );

    this.form = this.fb.group({
      timeValue: this.valueFormControl,
      comment: this.commentFormControl
    });

    this.resetFormControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resetFormControl();
  }

  // unsubscribe when the object is destroyed to prevent memory leaks
  ngOnDestroy(): void {
    this.unsubscribeFromValueChanges();
  }

  getNewValue(): CreateTimeValue | false {
    if (this.mode !== 'create' || !this.form.valid) {
      return false;
    }

    const newTimeValue = new CreateTimeValue();

    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      newTimeValue.valueHasComment = this.commentFormControl.value;
    }

    return newTimeValue;
  }

  getUpdatedValue(): UpdateTimeValue | false {
    if (this.mode !== 'update' || !this.form.valid) {
      return false;
    }

    const updatedTimeValue = new UpdateTimeValue();

    updatedTimeValue.id = this.displayValue.id;

    let splitTime = this.valueFormControl.value.time.split(":");

    console.log('year: ', this.valueFormControl.value.date.calendarStart.year);
    console.log('month: ', this.valueFormControl.value.date.calendarStart.month);
    console.log('day: ', this.valueFormControl.value.date.calendarStart.day);
    console.log('hour: ', splitTime[0]);
    console.log('minutes: ', splitTime[1]);

    const formattedDate = new Date(this.valueFormControl.value.date.calendarStart.year,
                                   (this.valueFormControl.value.date.calendarStart.month - 1),
                                   this.valueFormControl.value.date.calendarStart.day,
                                   splitTime[0],
                                   splitTime[1]
    );

    console.log('formatted date: ', formattedDate);
    console.log('updated date: ', this.valueFormControl.value.date);
    console.log('updated time: ', this.valueFormControl.value.time);

    updatedTimeValue.time = formattedDate.toISOString();

    // add the submitted comment to updatedIntervalValue only if user has added a comment
    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      updatedTimeValue.valueHasComment = this.commentFormControl.value;
    }

    return updatedTimeValue;
  }


}
