import {Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {BaseValueComponent} from "../base-value.component";
import {CreateIntervalValue, ReadIntervalValue, UpdateIntervalValue} from "@knora/api";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn} from "@angular/forms";
import {Subscription} from "rxjs";
import {Interval, IntervalInputComponent} from './interval-input/interval-input.component';

@Component({
  selector: 'kui-interval-value',
  templateUrl: './interval-value.component.html',
  styleUrls: ['./interval-value.component.scss']
})
export class IntervalValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('intervalInput', {static: false}) intervalInputComponent: IntervalInputComponent;

  @Input() displayValue?: ReadIntervalValue;

  valueFormControl: FormControl;
  commentFormControl: FormControl;

  form: FormGroup;

  valueChangesSubscription: Subscription;

  customValidators = [];

  constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    super();
  }

  standardValidatorFunc: (val: any, comment: string, commentCtrl: FormControl) => ValidatorFn = (initValue: any, initComment: string, commentFormControl: FormControl): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: any } | null => {

      const invalid = (control.value !== null && initValue.start === control.value.start && initValue.end === control.value.end)
        && (initComment === commentFormControl.value || (initComment === null && commentFormControl.value === ''));

      return invalid ? {valueNotChanged: {value: control.value}} : null;
    };
  };

  getInitValue(): Interval | null {
    if (this.displayValue !== undefined) {
      return new Interval(this.displayValue.start, this.displayValue.end);
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
      intervalValue: this.valueFormControl,
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

  getNewValue(): CreateIntervalValue | false {
    if (this.mode !== 'create' || !this.form.valid) {
      return false;
    }

    const newIntervalValue = new CreateIntervalValue();

    newIntervalValue.start = this.valueFormControl.value.start;
    newIntervalValue.end = this.valueFormControl.value.end;

    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      newIntervalValue.valueHasComment = this.commentFormControl.value;
    }

    return newIntervalValue;
  }

  getUpdatedValue(): UpdateIntervalValue | false {
    if (this.mode !== 'update' || !this.form.valid) {
      return false;
    }

    const updatedIntervalValue = new UpdateIntervalValue();

    updatedIntervalValue.id = this.displayValue.id;

    updatedIntervalValue.start = this.valueFormControl.value.start;
    updatedIntervalValue.end = this.valueFormControl.value.end;

    // add the submitted comment to updatedIntValue only if user has added a comment
    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      updatedIntervalValue.valueHasComment = this.commentFormControl.value;
    }

    return updatedIntervalValue;
  }

}
