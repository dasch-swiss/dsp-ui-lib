import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { BaseValueComponent } from '../base-value.component';
import { ValueErrorStateMatcher } from '../value-error-state-matcher';
import { CreateDecimalValue, ReadDecimalValue, UpdateDecimalValue } from '@dasch-swiss/dsp-js';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomRegex } from '../custom-regex';

@Component({
    selector: 'dsp-decimal-value',
    templateUrl: './decimal-value.component.html',
    styleUrls: ['./decimal-value.component.scss']
})
export class DecimalValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {

    @Input() displayValue?: ReadDecimalValue;

    valueFormControl: FormControl;
    commentFormControl: FormControl;

    form: FormGroup;
    matcher = new ValueErrorStateMatcher();
    valueChangesSubscription: Subscription;

    customValidators = [Validators.pattern(CustomRegex.DECIMAL_REGEX)]; // only allow for decimal values

    constructor(@Inject(FormBuilder) private _fb: FormBuilder) {
        super();
    }

    getInitValue(): number | null {
        if (this.displayValue !== undefined) {
            return this.displayValue.decimal;
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

        this.form = this._fb.group({
            decimalValue: this.valueFormControl,
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

    getNewValue(): CreateDecimalValue | false {
        if (this.mode !== 'create' || !this.form.valid) {
            return false;
        }

        const newDecimalValue = new CreateDecimalValue();

        newDecimalValue.decimal = this.valueFormControl.value;

        if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
            newDecimalValue.valueHasComment = this.commentFormControl.value;
        }

        return newDecimalValue;
    }

    getUpdatedValue(): UpdateDecimalValue | false {
        if (this.mode !== 'update' || !this.form.valid) {
            return false;
        }

        const updatedDecimalValue = new UpdateDecimalValue();

        updatedDecimalValue.id = this.displayValue.id;

        updatedDecimalValue.decimal = this.valueFormControl.value;

        // add the submitted comment to updatedIntValue only if user has added a comment
        if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
            updatedDecimalValue.valueHasComment = this.commentFormControl.value;
        }

        return updatedDecimalValue;
    }

}
