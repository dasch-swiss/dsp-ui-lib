import {Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BaseValueComponent} from '../base-value.component';
import {CreateIntValue, ReadIntValue, UpdateIntValue} from '@knora/api';
import {Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomRegex} from '../custom-regex';

@Component({
  selector: 'kui-int-value',
  templateUrl: './int-value.component.html',
  styleUrls: ['./int-value.component.scss']
})
export class IntValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {

  @Input() displayValue?: ReadIntValue;

  valueFormControl: FormControl;
  commentFormControl: FormControl;

  form: FormGroup;

  valueChangesSubscription: Subscription;

  customValidators = [Validators.pattern(CustomRegex.INT_REGEX)]; // only allow for integer values (no fractions)

  constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    super();
  }

  getInitValue(): number | null {
    if (this.displayValue !== undefined) {
      return this.displayValue.int;
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
      intValue: this.valueFormControl,
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

  getNewValue(): CreateIntValue | false {
    if (this.mode !== 'create' || !this.form.valid) {
      return false;
    }

    const newIntValue = new CreateIntValue();

    newIntValue.int = this.valueFormControl.value;

    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      newIntValue.valueHasComment = this.commentFormControl.value;
    }

    return newIntValue;
  }

  getUpdatedValue(): UpdateIntValue | false {
    if (this.mode !== 'update' || !this.form.valid) {
      return false;
    }

    const updatedIntValue = new UpdateIntValue();

    updatedIntValue.id = this.displayValue.id;

    updatedIntValue.int = this.valueFormControl.value;

    // add the submitted comment to updatedIntValue only if user has added a comment
    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      updatedIntValue.valueHasComment = this.commentFormControl.value;
    }

    return updatedIntValue;
  }

}
