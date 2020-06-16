import {Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BaseValueComponent} from '../base-value.component';
import {CreateGeonameValue, ReadGeonameValue, UpdateGeonameValue} from '@dasch-swiss/dsp-js';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import { CustomRegex } from '../custom-regex';
import { ValueErrorStateMatcher } from '../value-error-state-matcher';

@Component({
  selector: 'dsp-geoname-value',
  templateUrl: './geoname-value.component.html',
  styleUrls: ['./geoname-value.component.scss']
})
export class GeonameValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {
  @Input() displayValue?: ReadGeonameValue;

  valueFormControl: FormControl;
  commentFormControl: FormControl;

  form: FormGroup;

  valueChangesSubscription: Subscription;
  matcher = new ValueErrorStateMatcher();
  customValidators = [Validators.pattern(CustomRegex.GEONAME_REGEX)];

  constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    super();
  }

  getInitValue(): string | null {

    if (this.displayValue !== undefined) {
      return this.displayValue.geoname;
    } else {
      return null;
    }
  }

  ngOnInit() {

    // initialize form control elements
    this.valueFormControl = new FormControl(null);

    this.commentFormControl = new FormControl(null);

    this.valueChangesSubscription = this.commentFormControl.valueChanges.subscribe(
      data => {
        this.valueFormControl.updateValueAndValidity();
      }
    );

    this.form = this.fb.group({
      geonameValue: this.valueFormControl,
      comment: this.commentFormControl
    });

    this.resetFormControl();
  }

  ngOnChanges(changes: SimpleChanges): void {

    // resets values and validators in form controls when input displayValue or mode changes
    // at the first call of ngOnChanges, form control elements are not initialized yet
    this.resetFormControl();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromValueChanges();
  }

  getNewValue(): CreateGeonameValue | false {

    if (this.mode !== 'create' || !this.form.valid) {
      return false;
    }

    const newGeonameValue = new CreateGeonameValue();

    newGeonameValue.geoname = this.valueFormControl.value;

    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      newGeonameValue.valueHasComment = this.commentFormControl.value;
    }

    return newGeonameValue;

  }

  getUpdatedValue(): UpdateGeonameValue | false {

    if (this.mode !== 'update' || !this.form.valid) {
      return false;
    }

    const updatedGeonameValue = new UpdateGeonameValue();

    updatedGeonameValue.id = this.displayValue.id;

    updatedGeonameValue.geoname = this.valueFormControl.value;

    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      updatedGeonameValue.valueHasComment = this.commentFormControl.value;
    }

    return updatedGeonameValue;
  }

  openInfo() {
    if (this.displayValue.geoname) {
      const url = 'https://www.geonames.org/' + this.displayValue.geoname;
      window.open(url, '_blank');
    }
  }

}
