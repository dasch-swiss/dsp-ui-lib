import { Component, OnInit, Inject, Input } from '@angular/core';
import {BaseValueComponent} from '../../base-value.component';
import { ReadTextValueAsString, CreateValue, UpdateValue, ReadTextValueAsHtml } from '@knora/api';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'kui-text-value-as-html',
  templateUrl: './text-value-as-html.component.html',
  styleUrls: ['./text-value-as-html.component.scss']
})
export class TextValueAsHtmlComponent extends BaseValueComponent implements OnInit {

  @Input() displayValue?: ReadTextValueAsHtml;

  valueFormControl: FormControl;
  commentFormControl: FormControl;

  form: FormGroup;

  valueChangesSubscription: Subscription;

  customValidators = [];

  constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    // initialize form control elements
    this.valueFormControl = new FormControl(null);

    this.commentFormControl = new FormControl(null);

    this.valueChangesSubscription = this.commentFormControl.valueChanges.subscribe(
      data => {
        this.valueFormControl.updateValueAndValidity();
      }
    );

    this.form = this.fb.group({
      textValue: this.valueFormControl,
      comment: this.commentFormControl
    });

    this.resetFormControl();
  }

  getInitValue() {
    if (this.displayValue !== undefined) {
      this.displayValue.html = '<p>This is a very simple HTML document with a <a href="http://rdfh.ch/c9824353ae06" class="kui-link">link</a></p>';
      console.log('added html: ', this.displayValue);
      return this.displayValue.html;
    } else {
      return null;
    }
  }
  getNewValue(): CreateValue | false {
    throw new Error("Method not implemented.");
  }
  getUpdatedValue(): UpdateValue | false {
    throw new Error("Method not implemented.");
  }

}
