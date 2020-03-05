import {Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BaseValueComponent} from '../base-value.component';
import {CreateListValue, ReadListValue, UpdateListValue} from '@knora/api';
import {Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomRegex} from '../custom-regex';

@Component({
  selector: 'kui-list-value',
  templateUrl: './list-value.component.html',
  styleUrls: ['./list-value.component.scss']
})
export class ListValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {

  @Input() displayValue?: ReadListValue;

  valueFormControl: FormControl;
  commentFormControl: FormControl;

  form: FormGroup;

  valueChangesSubscription: Subscription;

  customValidators = [];

  constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    super();
   }

   getInitValue(): string | null {
    if (this.displayValue !== undefined) {
      return this.displayValue.listNodeLabel;
    } else {
      return null;
    }
   }

  ngOnInit() {
    this.valueFormControl = new FormControl(null);
    this.commentFormControl = new FormControl(null);

    this.valueChangesSubscription = this.commentFormControl.valueChanges.subscribe(
      data => {
        this.valueFormControl.updateValueAndValidity();
      }
    );

    this.form = this.fb.group({
      listValue: this.valueFormControl,
      comment: this.commentFormControl
    });

    this.resetFormControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resetFormControl();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromValueChanges();
  }

  getNewValue(): CreateListValue | false {
    if (this.mode !== 'create' || !this.form.valid) {
      return false;
    }

    const newListValue = new CreateListValue();

    newListValue.listNode = this.valueFormControl.value;

    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      newListValue.valueHasComment = this.commentFormControl.value;
    }

    return newListValue;
  }

  getUpdatedValue(): UpdateListValue | false {
    if (this.mode !== 'update' || !this.form.valid) {
      return false;
    }

    const updatedListValue = new UpdateListValue();

    updatedListValue.id = this.displayValue.id;

    updatedListValue.listNode = this.valueFormControl.value;

    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      updatedListValue.valueHasComment = this.commentFormControl.value;
    }

    return updatedListValue;
  }

}
