import {Input} from '@angular/core';
import {CreateValue, ReadValue, UpdateValue} from '@knora/api';
import {FormGroup} from '@angular/forms';

export abstract class BaseValueComponent {

  @Input() abstract displayValue?: ReadValue;

  @Input() mode: 'read' | 'update' | 'create' | 'search';

  form: FormGroup;

  abstract restoreDisplayValue(): void;

  abstract getNewValue(): CreateValue;

  abstract getUpdatedValue(): UpdateValue;
}
