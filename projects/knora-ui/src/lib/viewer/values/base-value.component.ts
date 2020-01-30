import {Input} from '@angular/core';
import {CreateValue, ReadValue, UpdateValue} from '@knora/api';
import {AbstractControl, FormControl, FormGroup, ValidatorFn} from '@angular/forms';

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
   * Reinits the form control elements
   * with displayValue's value and value comment.
   */
  abstract reinitFormControl(): void;

  abstract getNewValue(): CreateValue | false;

  abstract getUpdatedValue(): UpdateValue | false;
}
