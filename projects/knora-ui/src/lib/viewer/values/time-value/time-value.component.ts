import { Component, OnInit, OnChanges, OnDestroy, ViewChild, Input, Inject, SimpleChanges } from '@angular/core';
import { TimeInputComponent, DateTime } from './time-input/time-input.component';
import { ReadTimeValue, CreateTimeValue, UpdateTimeValue, KnoraDate } from '@knora/api';
import { BaseValueComponent } from '..';
import { FormControl, FormGroup, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IntervalErrorStateMatcher } from '../interval-value/interval-value.component';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { CustomRegex } from '../custom-regex';

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
  initKnoraDate: KnoraDate; // used to display the initial value which will be an instance of KnoraDate
  convertedControlDate: KnoraDate; // used to check the validity of the initial KnoraDate
  updateDate: Date; // used in order to easily convert a Javascript Date object into a timestamp string using .toISOString()

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

      const invalid = (control.value !== null &&
                       (_.isEqual(initValue.date, this.convertedControlDate) || initValue.date === control.value.date) &&
                       (initValue.time === control.value.time || control.value.time.match(CustomRegex.TIME_REGEX) == null) &&
                       (initComment === commentFormControl.value || (initComment === null && commentFormControl.value === '')));

      return invalid ? {valueNotChanged: {value: control.value}} : null;
    };
  };

  getInitValue(): DateTime | null {
    if (this.displayValue !== undefined) {
      
      const datePipe = new DatePipe('en-US');
      this.date = datePipe.transform(this.displayValue.time, "d.M.y");
      this.time = datePipe.transform(this.displayValue.time, "HH:mm");

      this.initKnoraDate = new KnoraDate("Gregorian",
                                          "AD",
                                          Number(datePipe.transform(this.displayValue.time, "y")),
                                          Number(datePipe.transform(this.displayValue.time, "M")),
                                          Number(datePipe.transform(this.displayValue.time, "d")));

      return new DateTime(this.initKnoraDate, this.time);
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

    // split the time entry in two to separate the hours and the minutes
    let splitTime = this.valueFormControl.value.time.split(":");

    // when the first value is displayed on page load, it will be an instance of KnoraDate
    if(this.valueFormControl.value.date instanceof KnoraDate){
      this.updateDate = new Date(this.valueFormControl.value.date.year,
                                (this.valueFormControl.value.date.month - 1),
                                this.valueFormControl.value.date.day,
                                splitTime[0],
                                splitTime[1]
      );
    } else { // when the user submits a new value, it will be an instance of GregorianCalendarDate
      this.updateDate = new Date(this.valueFormControl.value.date.calendarStart.year,
                                (this.valueFormControl.value.date.calendarStart.month - 1),
                                this.valueFormControl.value.date.calendarStart.day,
                                splitTime[0],
                                splitTime[1]
      );
    }

    // convert the updateDate to a timestamp so that knora will accept it
    updatedTimeValue.time = this.updateDate.toISOString();

    // add the submitted comment to updatedTimeValue only if user has added a comment
    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      updatedTimeValue.valueHasComment = this.commentFormControl.value;
    }

    return updatedTimeValue;
  }


}
