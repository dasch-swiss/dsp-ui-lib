import {Input} from '@angular/core';
import {CreateValue, ReadValue, UpdateValue} from '@knora/api';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

export function valueChangedValidator(initValue: any, initComment: string, commentFormControl: FormControl): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {

    console.log(initValue, ', ', initComment, ', ', commentFormControl.value);

    const invalid = initValue === control.value
      && (initComment === commentFormControl.value || (initComment === null && commentFormControl.value === ''));

    return invalid ? {valueNotChanged: {value: control.value}} : null;
  };
}

export function commentValidator(valueControl: FormControl): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {

    valueControl.updateValueAndValidity();

    const invalid = false;
    return invalid ? {valueNotChanged: {value: control.value}} : null;

  };
}

export abstract class BaseValueComponent {

  @Input() abstract displayValue?: ReadValue;

  @Input() mode: 'read' | 'update' | 'create' | 'search';

  valueFormControl: FormControl;
  commentFormControl: FormControl;

  form: FormGroup;

  /**
   * Returns the initially given value set via displayValue.
   * Returns null if no value was given.
   */
  abstract getInitValue(): any;

  /**
   * Returns the initially given value comment set via displayValue.
   * Returns null if no value comment was given.
   */
  getInitComment(): string | null {

    if (this.displayValue !== undefined && this.displayValue.valueHasComment !== undefined) {
      return this.displayValue.valueHasComment;
    } else {
      return null;
    }
  }

  /**
   * Resets the form control elements
   * with displayValue's value and value comment.
   * Depending on the mode, validators are reset.
   */
  resetFormControl(): void {
    const initialValue = this.getInitValue();
    const initialComment = this.getInitComment();

    console.log('reset value');
    this.valueFormControl.setValue(initialValue);
    this.commentFormControl.setValue(initialComment);

    this.valueFormControl.clearValidators();
    this.commentFormControl.clearValidators();

    // set validators depending on mode
    if (this.mode === 'update') {
      console.log('reset update validators');
      this.valueFormControl.setValidators([Validators.required, valueChangedValidator(initialValue, initialComment, this.commentFormControl)]);
      this.commentFormControl.setValidators([commentValidator(this.valueFormControl)]);
    } else {
      console.log('reset read/create validators');
      this.valueFormControl.setValidators([Validators.required]);

    }

    this.valueFormControl.updateValueAndValidity();
    this.commentFormControl.updateValueAndValidity();

  }

  /**
   * Returns a value that is to be created.
   * Returns false if invalid.
   */
  abstract getNewValue(): CreateValue | false;

  /**
   * Returns a value that is to be updated.
   * Returns false if invalid.
   */
  abstract getUpdatedValue(): UpdateValue | false;
}
