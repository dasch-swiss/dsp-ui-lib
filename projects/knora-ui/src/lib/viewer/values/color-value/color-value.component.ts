import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CreateColorValue, ReadColorValue, UpdateColorValue } from '@knora/api';
import { Subscription } from 'rxjs';
import { BaseValueComponent } from '../base-value.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';

@Component({
  selector: 'kui-color-value',
  templateUrl: './color-value.component.html',
  styleUrls: ['./color-value.component.scss']
})
export class ColorValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('colorInput', { static: false }) colorPickerComponent: ColorPickerComponent;

  @Input() displayValue?: ReadColorValue;
  /* colorValue: string;
  colorLabel: string; */

  valueFormControl: FormControl;
  commentFormControl: FormControl;

  form: FormGroup;

  valueChangesSubscription: Subscription;

  // customValidators = [Validators.pattern(CustomRegex.COLOR_REGEX)];
  customValidators = [];

  constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    super();
  }

  getInitValue(): string | null {
    if (this.displayValue !== undefined) {
      return this.displayValue.color;
    } else {
      return null;
    }
  }

  getInitLabel(): string | null {
    if (this.displayValue !== undefined) {
      return this.displayValue.strval;
    } else {
      return null;
    }
  }

  ngOnInit() {

    // set color value and label
    /* this.colorValue = this.displayValue.color;
    this.colorLabel = this.displayValue.strval; */

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

  // override the resetFormControl() from the base component to deal with the disabled state and the checkbox label
  /* resetFormControl(): void {
    super.resetFormControl();

    if (this.displayValue !== undefined) {
      this.colorValue = this.getInitValue();
      this.colorLabel = this.getInitLabel();
    }
  } */

  getNewValue(): CreateColorValue | false {
    if (this.mode !== 'create' || !this.form.valid) {
      return false;
    }

    const newColorValue = new CreateColorValue();

    newColorValue.color = this.valueFormControl.value;

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

    updatedColorValue.color = this.valueFormControl.value;

    // add the submitted comment to updatedIntValue only if user has added a comment
    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      updatedColorValue.valueHasComment = this.commentFormControl.value;
    }

    return updatedColorValue;
  }

  // update dynamically the background-color and the input label according to the picked color
  /* onColorChanged(updatedValue: any): void {
    if (updatedValue) {
      this.colorValue = updatedValue;
      this.colorLabel = updatedValue;
      this.form.get('colorValue').setValue(updatedValue);
    }
  } */

}
