import {Component, Inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BaseValueComponent} from '../../base-value.component';
import {CreateTextValueAsString, ReadTextValueAsString, UpdateTextValueAsString} from '@knora/api';
import {FormBuilder, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'lib-text-value-as-string',
  templateUrl: './text-value-as-string.component.html',
  styleUrls: ['./text-value-as-string.component.scss']
})
export class TextValueAsStringComponent extends BaseValueComponent implements OnInit, OnChanges {

  @Input() displayValue?: ReadTextValueAsString;

  constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    super();
  }

  private getInitValue(): string | null {

    if (this.displayValue !== undefined) {
      return this.displayValue.text;
    } else {
      return null;
    }
  }

  private getInitComment(): string | null {

    if (this.displayValue !== undefined && this.displayValue.valueHasComment !== undefined) {
      return this.displayValue.valueHasComment;
    } else {
      return null;
    }
  }

  reinitFormControl(): void {
    this.valueFormControl.setValue(this.getInitValue());
    this.commentFormControl.setValue(this.getInitComment());
  }

  ngOnInit() {

    // initialize form control elements
    this.valueFormControl = new FormControl(null, Validators.required);
    this.commentFormControl = new FormControl(null);

    this.form = this.fb.group({
      textValue: this.valueFormControl,
      comment: this.commentFormControl
    });

    this.reinitFormControl();
  }

  ngOnChanges(changes: SimpleChanges): void {

    // reinit value and comment in form controls when input displayValue changes
    // at the first call of ngOnChanges, form control elements are not initialized yet
    if (changes.displayValue !== undefined && this.valueFormControl !== undefined && this.commentFormControl !== undefined) {
      this.reinitFormControl();
    }
  }

  getNewValue(): CreateTextValueAsString | false {

    if (this.mode !== 'create' || !this.form.valid) {
      return false;
    }

    const newTextValue = new CreateTextValueAsString();

    newTextValue.text = this.valueFormControl.value;

    newTextValue.valueHasComment = this.commentFormControl.value;

    return newTextValue;

  }

  getUpdatedValue(): UpdateTextValueAsString | false {

    if (this.mode !== 'update' || !this.form.valid) {
      return false;
    }

    const updatedTextValue = new UpdateTextValueAsString();

    updatedTextValue.id = this.displayValue.id;

    updatedTextValue.text = this.valueFormControl.value;

    updatedTextValue.valueHasComment = this.valueFormControl.value;

    return updatedTextValue;
  }
}
