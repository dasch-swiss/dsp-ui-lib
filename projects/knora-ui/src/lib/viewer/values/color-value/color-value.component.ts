import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { CreateColorValue, ReadColorValue, UpdateColorValue } from '@knora/api';
import { Subscription } from 'rxjs';
import { BaseValueComponent } from '../base-value.component';
import { ColorPickerComponent, ColorPicker } from './color-picker/color-picker.component';
import { ErrorStateMatcher } from '@angular/material';
import { CustomRegex } from '../custom-regex';

/** Error when invalid control is dirty, touched, or submitted. */
export class ColorErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'kui-color-value',
  templateUrl: './color-value.component.html',
  styleUrls: ['./color-value.component.scss']
})
export class ColorValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('colorInput', { static: false }) colorPickerComponent: ColorPickerComponent;

  @Input() displayValue?: ReadColorValue;

  valueFormControl: FormControl;
  commentFormControl: FormControl;
  form: FormGroup;
  valueChangesSubscription: Subscription;
  customValidators = [];
  matcher = new ColorErrorStateMatcher();

  constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    super();
  }

  standardValidatorFunc: (val: any, comment: string, commentCtrl: FormControl) => ValidatorFn
    = (initValue: any, initComment: string, commentFormControl: FormControl): ValidatorFn => {
      return (control: AbstractControl): { [key: string]: any } | null => {

        const invalid = (control.value !== null && (initValue.color === control.value.color || control.value.color.match(CustomRegex.COLOR_REGEX) == null))
          && (initComment === commentFormControl.value || (initComment === null && commentFormControl.value === ''));

        return invalid ? { valueNotChanged: { value: control.value } } : null;
      };
    }

  getInitValue(): ColorPicker | null {
    if (this.displayValue !== undefined) {
      return new ColorPicker(this.displayValue.color);
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
      colorValue: this.valueFormControl,
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

  getNewValue(): CreateColorValue | false {
    if (this.mode !== 'create' || !this.form.valid) {
      return false;
    }

    const newColorValue = new CreateColorValue();

    newColorValue.color = this.valueFormControl.value.color;

    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      newColorValue.valueHasComment = this.commentFormControl.value;
    }

    return newColorValue;
  }

  getUpdatedValue(): UpdateColorValue | false {
    if (this.mode !== 'update' || !this.form.valid) {
      return false;
    }

    const updatedColorValue = new UpdateColorValue();

    updatedColorValue.id = this.displayValue.id;

    updatedColorValue.color = this.valueFormControl.value.color;

    // add the submitted comment to updatedIntValue only if user has added a comment
    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      updatedColorValue.valueHasComment = this.commentFormControl.value;
    }

    return updatedColorValue;
  }

}
