import {Input} from '@angular/core';
import {CreateValue, ReadValue, UpdateValue} from '@knora/api';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

export function valueChangedValidator(initValue: any, initComment: string, commentFormControl: FormControl): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {

    // console.log(initValue, ', ', initComment, ', ', commentFormControl.value);

    const invalid = initValue === control.value
      && (initComment === commentFormControl.value || (initComment === null && commentFormControl.value === ''));

    return invalid ? {valueNotChanged: {value: control.value}} : null;
  };
}

export abstract class BaseValueComponent {

  /**
   * Value to be displayed, if any.
   */
  @Input() abstract displayValue?: ReadValue;

  /**
   * Sets the mode of the component.
   */
  @Input() mode: 'read' | 'update' | 'create' | 'search';

  /**
   * FormControl element for the value.
   */
  abstract valueFormControl: FormControl;

  /**
   * FormControl element for the comment on the value.
   */
  abstract commentFormControl: FormControl;

  /**
   * FormGroup that contains FormControl elements.
   */
  abstract form: FormGroup;

  /**
   * Subscription used for when the value changes.
   */
  abstract valueChangesSubscription: Subscription;

  /**
   * Custom validators for a specific value type.
   * Can be initialized to an empty array if not needed.
   */
  abstract customValidators: ValidatorFn[];

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
  resetFormControl(shouldConvert?: boolean): void {
    if (this.valueFormControl !== undefined && this.commentFormControl !== undefined){

      let initialValue = this.getInitValue();
      const initialComment = this.getInitComment();

      console.log('initial value: ' + initialValue);

      if(shouldConvert){
        initialValue = this.convertToTimeStamp(initialValue);
        console.log('Coverted string: ' + initialValue);
      }

      this.valueFormControl.setValue(initialValue);
      this.commentFormControl.setValue(initialComment);

      this.valueFormControl.clearValidators();

      // set validators depending on mode
      if (this.mode === 'update') {
        // console.log('reset update validators');
        this.valueFormControl.setValidators([Validators.required, valueChangedValidator(initialValue, initialComment, this.commentFormControl)].concat(this.customValidators));
      } else {
        // console.log('reset read/create validators');
        this.valueFormControl.setValidators([Validators.required].concat(this.customValidators));

      }

      this.valueFormControl.updateValueAndValidity();
    }
  }

  convertToTimeStamp(strToConvert: string): string | null {
    const datePipe = new DatePipe('en-US');
    const convertedStr = datePipe.transform(strToConvert, "HH:mm");
    return convertedStr;
  }

  /**
   * Unsubscribes from the valueChangesSubscription
   */
  unsubscribeFromValueChanges(): void{
    if (this.valueChangesSubscription !== undefined) {
      this.valueChangesSubscription.unsubscribe();
    }
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
