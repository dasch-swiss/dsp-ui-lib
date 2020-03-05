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
  options: string[];
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

  // override the resetFormControl() from the base component to deal with initial link value label
  resetFormControl(): void {
    super.resetFormControl();

    if (this.valueFormControl !== undefined) {
      if (this.mode === 'read') {
        this.valueFormControl.setValue(this.getInitValue());
        this.commentFormControl.setValue(this.getInitComment());

        this.valueFormControl.clearValidators();
      } else {
        this.valueFormControl.setValue('');
        // this.valueChangesSubscription = this.valueFormControl.valueChanges.subscribe(data => {
        //   this.options = this.searchByLabel(data);
        // });
        this.valueFormControl.clearValidators();
      }
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
    console.log(this.displayValue)
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
