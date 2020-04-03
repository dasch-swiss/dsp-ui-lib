import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { CreateColorValue, ReadColorValue, UpdateColorValue } from '@knora/api';
import { Subscription } from 'rxjs';
import { BaseValueComponent } from '../base-value.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { ErrorStateMatcher } from '@angular/material';
import { CustomRegex } from '../custom-regex';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';

/** Error when invalid control is dirty, touched, or submitted. */
export class ColorErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'kui-color-value',
  templateUrl: './color-value.component.html',
  styleUrls: ['./color-value.component.scss']
})
export class ColorValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('colorInput', { static: false }) colorPickerComponent: ColorPickerComponent;
  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  @Input() displayValue?: ReadColorValue;

  valueFormControl: FormControl;
  commentFormControl: FormControl;
  form: FormGroup;
  valueChangesSubscription: Subscription;
  customValidators = [Validators.pattern(CustomRegex.COLOR_REGEX)];
  matcher = new ColorErrorStateMatcher();

  constructor(@Inject(FormBuilder) private fb: FormBuilder, private _ngZone: NgZone) {
    super();
  }

  getInitValue(): string | null {
    if (this.displayValue !== undefined) {
      return this.displayValue.color;
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
      colorValue: this.valueFormControl,
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

  getNewValue(): CreateColorValue | false {
    if (this.mode !== 'create' || !this.form.valid) {
      return false;
    }

    const newColorValue = new CreateColorValue();

    newColorValue.color = this.valueFormControl.value;

    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      newColorValue.valueHasComment = this.commentFormControl.value;
    }


    return newColorValue;
  }

  getUpdatedValue(): UpdateColorValue | false {
    if (this.mode !== 'update' || !this.form.valid) {
      return false;
    }

    const updatedColorValue = new UpdateColorValue();

    updatedColorValue.id = this.displayValue.id;

    updatedColorValue.color = this.valueFormControl.value;

    // add the submitted comment to updatedIntValue only if user has added a comment
    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      updatedColorValue.valueHasComment = this.commentFormControl.value;
    }

    return updatedColorValue;
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

}
