import {Input} from '@angular/core';
import {CreateValue, ReadValue, UpdateValue} from '@knora/api';
import {FormControl, FormGroup} from '@angular/forms';

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

  abstract getNewValue(): CreateValue;

  abstract getUpdatedValue(): UpdateValue;
}
