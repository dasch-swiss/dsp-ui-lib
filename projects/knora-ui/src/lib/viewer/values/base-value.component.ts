import {Input} from '@angular/core';
import {CreateValue, ReadValue, UpdateValue} from '@knora/api';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

export function valueChangedValidator(initValue: any): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const invalid = initValue === control.value;
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
   * Gets the initially given value.
   * Returns null if no value is given.
   */
  abstract getInitValue(): any;

  abstract getInitComment(): any;

  /**
   * Resets the form control elements
   * with displayValue's value and value comment.
   * Depending on the mode validators are reset.
   */
  resetFormControl(): void {
    const initialValue = this.getInitValue();
    const initialComment = this.getInitComment();

    console.log('reset value');
    this.valueFormControl.setValue(initialValue);
    this.commentFormControl.setValue(initialComment);

    this.valueFormControl.clearValidators();

    // set validators depending on mode
    if (this.mode === 'update') {
      console.log('reset update validators');
      this.valueFormControl.setValidators([Validators.required, valueChangedValidator(initialValue)]);
    } else {
      console.log('reset read/create validators');
      this.valueFormControl.setValidators([Validators.required]);
    }

    this.valueFormControl.updateValueAndValidity();

  }

  abstract getNewValue(): CreateValue | false;

  abstract getUpdatedValue(): UpdateValue | false;
}
