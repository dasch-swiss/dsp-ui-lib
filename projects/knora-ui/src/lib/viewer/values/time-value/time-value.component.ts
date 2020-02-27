import { Component, OnInit, OnChanges, OnDestroy, ViewChild, Input, Inject, SimpleChanges, LOCALE_ID } from '@angular/core';
import { TimeInputComponent, DateTime } from './time-input/time-input.component';
import { ReadTimeValue, CreateTimeValue, UpdateTimeValue, KnoraDate } from '@knora/api';
import { BaseValueComponent } from '..';
import { FormControl, FormGroup, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IntervalErrorStateMatcher } from '../interval-value/interval-value.component';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';

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
  convertedControlDate: KnoraDate;

  form: FormGroup;

  valueChangesSubscription: Subscription;

  customValidators = [];

  matcher = new IntervalErrorStateMatcher();

  constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    super();
  }

  standardValidatorFunc: (val: any, comment: string, commentCtrl: FormControl) => ValidatorFn
    = (initValue: any, initComment: string, commentFormControl: FormControl): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: any } | null => {

      if(control.value.date !== null && !(control.value.date instanceof KnoraDate)){
        this.convertedControlDate = new KnoraDate("Gregorian",
                                                  "AD",
                                                  control.value.date.calendarStart.year,
                                                  control.value.date.calendarStart.month,
                                                  control.value.date.calendarStart.day);
      }

      // console.log('initValue.date: ', initValue.date);
      // console.log('convertedControlDate: ', this.convertedControlDate)
      // console.log('control.value.date: ', control.value.date);
      // console.log('initValue.time: ', initValue.time);
      // console.log('control.value.time: ', control.value.time);

      // console.log('check 1: ', control.value !== null);
      // console.log('check 2: ', this.convertedControlDate !== undefined);
      // console.log('check 2: ', (initValue.date === this.convertedControlDate || initValue.date === control.value.date));
      // console.log('check 3: ', initValue.time === control.value.time);
      // console.log('check 4: ', (initComment === commentFormControl.value || (initComment === null && commentFormControl.value === '')));
      // console.log('initValue.date === this.convertedControlDate: ', initValue.date === this.convertedControlDate);
      // console.log('initValue.date === control.value.date: ', initValue.date === control.value.date);
      // console.log('objects are equal: ', _.isEqual(initValue.date, this.convertedControlDate));
      
      const invalid = (control.value !== null &&
                       (_.isEqual(initValue.date, this.convertedControlDate) || initValue.date === control.value.date) && 
                       initValue.time === control.value.time) && 
                       (initComment === commentFormControl.value || (initComment === null && commentFormControl.value === ''));

      // console.log('invalid: ', invalid);

      return invalid ? {valueNotChanged: {value: control.value}} : null;
    };
  };

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
      comment: this.commentFormControl,
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

    // console.log('year: ', this.valueFormControl.value.date.calendarStart.year);
    // console.log('month: ', this.valueFormControl.value.date.calendarStart.month);
    // console.log('day: ', this.valueFormControl.value.date.calendarStart.day);
    // console.log('hour: ', splitTime[0]);
    // console.log('minutes: ', splitTime[1]);

    const formattedDate = new Date(this.valueFormControl.value.date.calendarStart.year,
                                   (this.valueFormControl.value.date.calendarStart.month - 1),
                                   this.valueFormControl.value.date.calendarStart.day,
                                   splitTime[0],
                                   splitTime[1]
    );

    // console.log('formatted date: ', formattedDate);
    // console.log('updated date: ', this.valueFormControl.value.date);
    // console.log('updated time: ', this.valueFormControl.value.time);

    updatedTimeValue.time = formattedDate.toISOString();

    // add the submitted comment to updatedIntervalValue only if user has added a comment
    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      updatedTimeValue.valueHasComment = this.commentFormControl.value;
    }

    return updatedTimeValue;
  }


}
