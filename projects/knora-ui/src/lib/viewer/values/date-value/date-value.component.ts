import {Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {CreateDateValue, KnoraDate, KnoraPeriod, ReadDateValue, UpdateDateValue} from '@knora/api';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {BaseValueComponent} from '../base-value.component';
import {ErrorStateMatcher} from '@angular/material';

/** Error when invalid control is dirty, touched, or submitted. */
export class IntervalErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'kui-date-value',
  templateUrl: './date-value.component.html',
  styleUrls: ['./date-value.component.scss']
})
export class DateValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {

  @Input() displayValue?: ReadDateValue;

  valueFormControl: FormControl;
  commentFormControl: FormControl;

  form: FormGroup;

  valueChangesSubscription: Subscription;

  customValidators = [];

  matcher = new IntervalErrorStateMatcher();

  constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    super();
  }

  getInitValue(): KnoraDate | KnoraPeriod | null {
    if (this.displayValue !== undefined) {
      return this.displayValue.date;
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
      dateValue: this.valueFormControl,
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

  getNewValue(): CreateDateValue | false {
    if (this.mode !== 'create' || !this.form.valid) {
      return false;
    }

    const newDateValue = new CreateDateValue();

    // newDateValue.int = this.valueFormControl.value;

    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      newDateValue.valueHasComment = this.commentFormControl.value;
    }

    return newDateValue;
  }

  getUpdatedValue(): UpdateDateValue | false {
    if (this.mode !== 'update' || !this.form.valid) {
      return false;
    }

    const updatedDateValue = new UpdateDateValue();

    updatedDateValue.id = this.displayValue.id;

    console.log(this.valueFormControl.value)

    updatedDateValue.calendar = (this.valueFormControl.value as KnoraDate).calendar;
    updatedDateValue.startEra = (this.valueFormControl.value as KnoraDate).era;
    updatedDateValue.startDay = (this.valueFormControl.value as KnoraDate).day;
    updatedDateValue.startMonth = (this.valueFormControl.value as KnoraDate).month;
    updatedDateValue.startYear = (this.valueFormControl.value as KnoraDate).year;
    updatedDateValue.endEra = updatedDateValue.startEra;
    updatedDateValue.endDay = updatedDateValue.startDay;
    updatedDateValue.endMonth = updatedDateValue.startMonth;
    updatedDateValue.endYear = updatedDateValue.startYear;

    // add the submitted comment to updatedIntValue only if user has added a comment
    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      updatedDateValue.valueHasComment = this.commentFormControl.value;
    }

    return updatedDateValue;
  }

}
