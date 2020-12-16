import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateGeonameValue, ReadGeonameValue, UpdateGeonameValue } from '@dasch-swiss/dsp-js';
import { Subscription } from 'rxjs';
import { BaseValueComponent } from '../base-value.component';
import { CustomRegex } from '../custom-regex';
import { ValueErrorStateMatcher } from '../value-error-state-matcher';

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);

@Component({
    selector: 'dsp-geoname-value',
    templateUrl: './geoname-value.component.html',
    styleUrls: ['./geoname-value.component.scss']
})
export class GeonameValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {
    @Input() displayValue?: ReadGeonameValue;
    @Input() label?: string;

    valueFormControl: FormControl;
    commentFormControl: FormControl;

    form: FormGroup;

    valueChangesSubscription: Subscription;
    matcher = new ValueErrorStateMatcher();
    customValidators = [Validators.pattern(CustomRegex.GEONAME_REGEX)];

    constructor(@Inject(FormBuilder) private _fb: FormBuilder) {
        super();
    }

    getInitValue(): string | null {

        if (this.displayValue !== undefined) {
            return this.displayValue.geoname;
        } else {
            return null;
        }
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

        this.form = this._fb.group({
            geonameValue: this.valueFormControl,
            comment: this.commentFormControl
        });

        this.resetFormControl();

        resolvedPromise.then(() => {
            // add form to the parent form group
            this.addToParentFormGroup(this.formName, this.form);
        });
    }

    ngOnChanges(changes: SimpleChanges): void {

        // resets values and validators in form controls when input displayValue or mode changes
        // at the first call of ngOnChanges, form control elements are not initialized yet
        this.resetFormControl();
    }

    ngOnDestroy(): void {
        this.unsubscribeFromValueChanges();

        resolvedPromise.then(() => {
            // remove form from the parent form group
            this.removeFromParentFormGroup(this.formName);
        });
    }

    getNewValue(): CreateGeonameValue | false {

        if (this.mode !== 'create' || !this.form.valid || this.isEmptyVal()) {
            return false;
        }

        const newGeonameValue = new CreateGeonameValue();

        newGeonameValue.geoname = this.valueFormControl.value;

        if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
            newGeonameValue.valueHasComment = this.commentFormControl.value;
        }

        return newGeonameValue;

    }

    getUpdatedValue(): UpdateGeonameValue | false {

        if (this.mode !== 'update' || !this.form.valid) {
            return false;
        }

        const updatedGeonameValue = new UpdateGeonameValue();

        updatedGeonameValue.id = this.displayValue.id;

        updatedGeonameValue.geoname = this.valueFormControl.value;

        if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
            updatedGeonameValue.valueHasComment = this.commentFormControl.value;
        }

        return updatedGeonameValue;
    }

}
