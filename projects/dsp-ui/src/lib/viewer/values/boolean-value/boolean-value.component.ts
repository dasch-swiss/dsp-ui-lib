import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CreateBooleanValue, ReadBooleanValue, UpdateBooleanValue } from '@knora/api';
import { Subscription } from 'rxjs';
import { BaseValueComponent } from '../base-value.component';

@Component({
    selector: 'dsp-boolean-value',
    templateUrl: './boolean-value.component.html',
    styleUrls: ['./boolean-value.component.scss']
})
export class BooleanValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {

    @Input() displayValue?: ReadBooleanValue;

    valueFormControl: FormControl;
    commentFormControl: FormControl;

    form: FormGroup;

    valueChangesSubscription: Subscription;

    customValidators = [];

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
        super();
    }

    getInitValue(): boolean | null {
        if (this.displayValue !== undefined) {
            return this.displayValue.bool;
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
            booleanValue: this.valueFormControl,
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

    getNewValue(): CreateBooleanValue | false {
        if (this.mode !== 'create' || !this.form.valid) {
            return false;
        }

        const newBooleanValue = new CreateBooleanValue();

        newBooleanValue.bool = this.valueFormControl.value;

        // add the submitted new comment to newBooleanValue only if the user has added a comment
        if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
            newBooleanValue.valueHasComment = this.commentFormControl.value;
        }

        return newBooleanValue;
    }

    getUpdatedValue(): UpdateBooleanValue | false {
        if (this.mode !== 'update' || !this.form.valid) {
            return false;
        }

        const updatedBooleanValue = new UpdateBooleanValue();

        updatedBooleanValue.id = this.displayValue.id;

        updatedBooleanValue.bool = this.valueFormControl.value;

        // add the submitted comment to updatedBooleanValue only if user has added a comment
        if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
            updatedBooleanValue.valueHasComment = this.commentFormControl.value;
        }

        return updatedBooleanValue;
    }

}
