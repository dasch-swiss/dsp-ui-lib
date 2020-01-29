import {Component, Inject, Input, OnInit} from '@angular/core';
import {BaseValueComponent} from '../../base-value.component';
import {CreateTextValueAsString, ReadTextValueAsString, UpdateTextValueAsString} from '@knora/api';
import {FormBuilder, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'lib-text-value-as-string',
  templateUrl: './text-value-as-string.component.html',
  styleUrls: ['./text-value-as-string.component.scss']
})
export class TextValueAsStringComponent extends BaseValueComponent implements OnInit {

  @Input() displayValue?: ReadTextValueAsString;

  valueFormControl: FormControl;
  commentFormControl: FormControl;

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

  restoreDisplayValue(): void {
    this.valueFormControl.setValue(this.getInitValue());
    this.commentFormControl.setValue(this.getInitComment());
  }

  ngOnInit() {

    this.valueFormControl = new FormControl(this.getInitValue(), Validators.required);
    this.commentFormControl = new FormControl(this.getInitComment());

    this.form = this.fb.group({
      textValue: this.valueFormControl,
      comment: this.commentFormControl
    });
  }

  getNewValue(): CreateTextValueAsString {

    const newTextValue = new CreateTextValueAsString();

    newTextValue.text = this.valueFormControl.value;

    newTextValue.valueHasComment = this.commentFormControl.value;

    return newTextValue;

  }

  getUpdatedValue(): UpdateTextValueAsString {

    const updatedTextValue = new UpdateTextValueAsString();

    updatedTextValue.id = this.displayValue.id;

    updatedTextValue.text = this.valueFormControl.value;

    updatedTextValue.valueHasComment = this.valueFormControl.value;

    return updatedTextValue;
  }
}
