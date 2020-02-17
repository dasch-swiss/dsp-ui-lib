import {Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BaseValueComponent} from '../base-value.component';
import {CreateLinkValue, ReadLinkValue, UpdateLinkValue} from '@knora/api';
import {Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'kui-link-value',
  templateUrl: './link-value.component.html',
  styleUrls: ['./link-value.component.scss']
})
export class LinkValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {

  @Input() displayValue?: ReadLinkValue;

  valueFormControl: FormControl;
  commentFormControl: FormControl;

  form: FormGroup;

  valueChangesSubscription: Subscription;

  customValidators = [Validators.pattern(/^-?\d+$/)];
  constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    super();
  }

  getInitValue(): string | null {
    if (this.displayValue !== undefined) {
      return this.displayValue.linkedResourceIri;
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
      linkValue: this.valueFormControl,
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

  getNewValue(): CreateLinkValue | false {
    if (this.mode !== 'create' || !this.form.valid) {
      return false;
    }

    const newLinkValue = new CreateLinkValue();

    newLinkValue.linkedResourceIri = this.valueFormControl.value;

    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      newLinkValue.valueHasComment = this.commentFormControl.value;
    }

    return newLinkValue;
  }

  getUpdatedValue(): UpdateLinkValue | false {
    if (this.mode !== 'update' || !this.form.valid) {
      return false;
    }

    const updatedLinkValue = new UpdateLinkValue();

    updatedLinkValue.id = this.displayValue.id;

    updatedLinkValue.linkedResourceIri = this.valueFormControl.value;

    // add the submitted comment to updatedLinkValue only if user has added a comment
    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      updatedLinkValue.valueHasComment = this.commentFormControl.value;
    }

    return updatedLinkValue;
  }

}
