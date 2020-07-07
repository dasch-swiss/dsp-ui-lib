import { Component, Inject, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { Constants, ResourcePropertyDefinition } from '@dasch-swiss/dsp-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    ComparisonOperator, ComparisonOperatorAndValue,
    Equals,
    Exists,
    GreaterThan,
    GreaterThanEquals,
    LessThan,
    LessThanEquals,
    Like,
    Match,
    NotEquals, PropertyValue, Value
} from './operator';
import { Subscription } from 'rxjs';

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);

@Component({
    selector: 'dsp-specify-property-value',
    templateUrl: './specify-property-value.component.html',
    styleUrls: ['./specify-property-value.component.scss']
})
export class SpecifyPropertyValueComponent implements OnChanges, OnDestroy {

    Constants = Constants;

    // parent FormGroup
    @Input() formGroup: FormGroup;

    @ViewChild('propertyValue', { static: false }) propertyValueComponent: PropertyValue;

    // setter method for the property chosen by the user
    @Input()
    set property(prop: ResourcePropertyDefinition) {
        this.comparisonOperatorSelected = undefined; // reset to initial state
        this._property = prop;
        this.resetComparisonOperators(); // reset comparison operators for given property (overwriting any previous selection)
    }

    // getter method for this._property
    get property(): ResourcePropertyDefinition {
        return this._property;
    }

    private _property: ResourcePropertyDefinition;

    form: FormGroup;

    // available comparison operators for the property
    comparisonOperators: Array<ComparisonOperator> = [];

    // comparison operator selected by the user
    comparisonOperatorSelected: ComparisonOperator;

    // the type of the property
    propertyValueType;

    comparisonOperatorChangesSubscription: Subscription;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnChanges(): void {

        // build a form for comparison operator selection
        this.form = this.fb.group({
            comparisonOperator: [null, Validators.required]
        });

        this._closeComparisonOperatorChangesSubscription();

        // store comparison operator when selected
        this.comparisonOperatorChangesSubscription = this.form.valueChanges.subscribe((data) => {
            this.comparisonOperatorSelected = data.comparisonOperator;
        });

        resolvedPromise.then(() => {

            // remove from the parent form group (clean reset)
            this.formGroup.removeControl('comparisonOperator');

            // add form to the parent form group
            this.formGroup.addControl('comparisonOperator', this.form);
        });

    }

    ngOnDestroy() {
        this._closeComparisonOperatorChangesSubscription();
    }

    /**
     * Resets the comparison operators for this._property.
     */
    resetComparisonOperators() {

        // depending on object class, set comparison operators and value entry field
        if (this._property.isLinkProperty) {
            this.propertyValueType = Constants.Resource;
        } else {
            this.propertyValueType = this._property.objectType;
        }

        switch (this.propertyValueType) {

            case Constants.TextValue:
                this.comparisonOperators = [new Like(), new Match(), new Equals(), new NotEquals(), new Exists()];
                break;

            case Constants.BooleanValue:
            case Constants.Resource:
            case Constants.UriValue:
                this.comparisonOperators = [new Equals(), new NotEquals(), new Exists()];
                break;

            case Constants.IntValue:
            case Constants.DecimalValue:
            case Constants.DateValue:
                this.comparisonOperators = [new Equals(), new NotEquals(), new LessThan(), new LessThanEquals(), new GreaterThan(), new GreaterThanEquals(), new Exists()];
                break;

            case Constants.ListValue:
                this.comparisonOperators = [new Equals(), new NotEquals(), new Exists()];
                break;

            case Constants.GeomValue:
            case Constants.FileValue:
            case Constants.AudioFileValue:
            case Constants.StillImageFileValue:
            case Constants.DDDFileValue:
            case Constants.MovingImageFileValue:
            case Constants.TextFileValue:
            case Constants.ColorValue:
            case Constants.IntervalValue:
                this.comparisonOperators = [new Exists()];
                break;

            default:
                console.log('ERROR: Unsupported value type ' + this._property.objectType);

        }

    }

    /**
     * Unsubscribe from form changes.
     */
    private _closeComparisonOperatorChangesSubscription() {
        if (this.comparisonOperatorChangesSubscription !== undefined) {
            this.comparisonOperatorChangesSubscription.unsubscribe();
        }
    }

    /**
     * Gets the specified comparison operator and value for the property.
     *
     * returns {ComparisonOperatorAndValue} the comparison operator and the specified value
     */
    getComparisonOperatorAndValueLiteralForProperty(): ComparisonOperatorAndValue {
        // return value (literal or IRI) from the child component
        let value: Value;

        // comparison operator 'Exists' does not require a value
        if (this.comparisonOperatorSelected.getClassName() !== 'Exists') {
            value = this.propertyValueComponent.getValue();
        }

        // return the comparison operator and the specified value
        return new ComparisonOperatorAndValue(this.comparisonOperatorSelected, value);

    }

}
