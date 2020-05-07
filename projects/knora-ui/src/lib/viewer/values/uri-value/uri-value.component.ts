import {Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BaseValueComponent} from '../base-value.component';
import {CreateUriValue, ReadUriValue, UpdateUriValue} from '@knora/api';
import {Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomRegex} from '../custom-regex';

@Component({
  selector: 'kui-uri-value',
  templateUrl: './uri-value.component.html',
  styleUrls: ['./uri-value.component.scss']
})
export class UriValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {

  @Input() displayValue?: ReadUriValue;

  valueFormControl: FormControl;
  commentFormControl: FormControl;

  form: FormGroup;

  valueChangesSubscription: Subscription;

  customValidators = [Validators.pattern(CustomRegex.URI_REGEX)];

  constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    super();
   }

   getInitValue(): string | null {
    if (this.displayValue !== undefined) {
      return this.displayValue.uri;
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
      uriValue: this.valueFormControl,
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

  getNewValue(): CreateUriValue | false {
    if(this.mode !== 'create' || !this.form.valid) {
      return false;
    }

    const newUriValue = new CreateUriValue();

    newUriValue.uri = this.valueFormControl.value;

    if(this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      newUriValue.valueHasComment = this.commentFormControl.value;
    }

    return newUriValue;
  }

  getUpdatedValue(): UpdateUriValue | false {
    if(this.mode !== 'update' || !this.form.valid) {
      return false;
    }
    const updatedUriValue = new UpdateUriValue();

    updatedUriValue.id = this.displayValue.id;

    updatedUriValue.uri = this.valueFormControl.value;

    if(this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      updatedUriValue.valueHasComment = this.commentFormControl.value;
    }

    return updatedUriValue;
  }

}
