import { Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourceClassDefinition, ResourcePropertyDefinition, Cardinality, IHasProperty } from '@dasch-swiss/dsp-js';
import { Subscription } from 'rxjs';
import { SortingService } from '../../../action';
import { SpecifyPropertyValueComponent } from './specify-property-value/specify-property-value.component';
import { ComparisonOperatorAndValue, PropertyWithValue } from './specify-property-value/operator';

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);

export interface Properties {
    [index: string]: ResourcePropertyDefinition;
}

@Component({
    selector: 'dsp-select-property',
    templateUrl: './select-property.component.html',
    styleUrls: ['./select-property.component.scss']
})
export class SelectPropertyComponent implements OnInit, OnDestroy {

    // parent FormGroup
    @Input() formGroup: FormGroup;

    // index of the given property (unique)
    @Input() index: number;

    // setter method for properties when being updated by parent component
    @Input()
    set properties(value: Properties) {
        this.propertySelected = undefined; // reset selected property (overwriting any previous selection)
        this._properties = value;
        this._updatePropertiesArray();
    }

    get properties() {
        return this._properties;
    }

    private _activeResourceClass?: ResourceClassDefinition;

    // setter method for selected resource class
    @Input()
    set activeResourceClass(value: ResourceClassDefinition) {
        this._activeResourceClass = value;
    }

    // properties that can be selected from
    private _properties: Properties;

    // reference to child component: combination of comparison operator and value for chosen property
    @ViewChild('specifyPropertyValue', { static: false }) specifyPropertyValue: SpecifyPropertyValueComponent;

    // properties as an Array structure (based on this.properties)
    propertiesAsArray: Array<ResourcePropertyDefinition>;

    // represents the currently selected property
    propertySelected: ResourcePropertyDefinition;

    form: FormGroup;

    // unique name for this property to be used in the parent FormGroup
    propIndex: string;

    propertyChangesSubscription: Subscription;

    constructor(
        @Inject(FormBuilder) private _fb: FormBuilder,
        private _sortingService: SortingService) {
    }

    ngOnInit() {

        // build a form for the property selection
        this.form = this._fb.group({
            property: [null, Validators.required],
            isSortCriterion: [false, Validators.required]
        });

        // update the selected property
        this.propertyChangesSubscription = this.form.valueChanges.subscribe((data) => {
            const propIri = data.property;
            this.propertySelected = this._properties[propIri];
        });

        resolvedPromise.then(() => {
            this.propIndex = 'property' + this.index;

            // add form to the parent form group
            this.formGroup.addControl(this.propIndex, this.form);
        });

    }

    ngOnDestroy() {

        // remove form from the parent form group
        resolvedPromise.then(() => {
            if (this.propertyChangesSubscription !== undefined) {
                this.propertyChangesSubscription.unsubscribe();
            }

            this.formGroup.removeControl(this.propIndex);
        });
    }

    /**
     * Updates the properties array that is accessed by the template.
     */
    private _updatePropertiesArray() {

        // represent the properties as an array to be accessed by the template
        const propsArray = [];

        for (const propIri in this._properties) {
            if (this._properties.hasOwnProperty(propIri)) {
                const prop = this._properties[propIri];

                // only list editable props that are not link value props
                if (prop.isEditable && !prop.isLinkValueProperty) {
                    propsArray.push(this._properties[propIri]);
                }
            }
        }

        // sort properties by label (ascending)
        this.propertiesAsArray = this._sortingService.keySortByAlphabetical(propsArray, 'label');
    }

    /**
     * Indicates if property can be used as a sort criterion.
     * Property has to have cardinality or max cardinality 1 for the chosen resource class.
     *
     * We cannot sort by properties whose cardinality is greater than 1.
     * Return boolean
     */
    sortCriterion(): boolean {

        // TODO: this method is called from teh template. It is called on each change detection cycle.
        // TODO: this is acceptable because this method has no side-effects
        // TODO: find a better way: evaluate once and store the result in a class member

        // check if a resource class is selected and if the property's cardinality is 1 for the selected resource class
        if (this._activeResourceClass !== undefined && this.propertySelected !== undefined && !this.propertySelected.isLinkProperty) {

            const cardinalities: IHasProperty[] = this._activeResourceClass.propertiesList.filter(
                (card: IHasProperty) => {
                    // cardinality 1 or max occurrence 1
                    return card.propertyIndex === this.propertySelected.id
                        && (card.cardinality === Cardinality._1 || card.cardinality === Cardinality._0_1);
                }
            );
            return cardinalities.length === 1;
        } else {
            return false;
        }

    }

    /**
     * Returns the selected property with the specified value.
     */
    getPropertySelectedWithValue(): PropertyWithValue {

        const propVal: ComparisonOperatorAndValue = this.specifyPropertyValue.getComparisonOperatorAndValueLiteralForProperty();

        let isSortCriterion = false;

        // only non linking properties can be used for sorting
        if (!this.propertySelected.isLinkProperty) {
            isSortCriterion = this.form.value.isSortCriterion;
        }

        return new PropertyWithValue(this.propertySelected, propVal, isSortCriterion);

    }

}
