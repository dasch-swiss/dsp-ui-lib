import { Component, OnInit, OnChanges, OnDestroy, ViewChild, Input, Inject, SimpleChanges } from '@angular/core';
import { TimeInputComponent, TimeInputErrorStateMatcher } from './time-input/time-input.component';
import { ReadTimeValue, CreateTimeValue, UpdateTimeValue } from '@knora/api';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import {BaseValueComponent} from '../base-value.component';

@Component({
  selector: 'kui-time-value',
  templateUrl: './time-value.component.html',
  styleUrls: ['./time-value.component.scss']
})
export class TimeValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('timeInput') timeInputComponent: TimeInputComponent;

  @Input() displayValue?: ReadTimeValue;

  valueFormControl: FormControl;
  commentFormControl: FormControl;

  form: FormGroup;

  valueChangesSubscription: Subscription;

  customValidators = [];

  matcher = new TimeInputErrorStateMatcher();

  constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    super();
  }

  getInitValue(): string | null {
    if (this.displayValue !== undefined) {
      return this.displayValue.time;
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

    newTimeValue.time = this.valueFormControl.value;

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
    updatedTimeValue.time = this.valueFormControl.value;

    // add the submitted comment to updatedTimeValue only if user has added a comment
    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      updatedTimeValue.valueHasComment = this.commentFormControl.value;
    }

    return updatedTimeValue;
  }

}
