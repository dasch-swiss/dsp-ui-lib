import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
    Constants,
    KnoraDate,
    PermissionUtil,
    ReadColorValue,
    ReadDateValue,
    ReadIntervalValue,
    ReadResource,
    ReadTimeValue,
    ReadValue,
    SystemPropertyDefinition
} from '@dasch-swiss/dsp-js';
import { ParseReadDateValue } from '@dasch-swiss/dsp-js/src/models/v2/resources/values/read/read-date-value';
import { AddValueComponent } from '../../operations/add-value/add-value.component';
import { DisplayEditComponent } from '../../operations/display-edit/display-edit.component';
import { PropertyInfoValues } from '../resource-view/resource-view.component';

@Component({
  selector: 'dsp-property-view',
  templateUrl: './property-view.component.html',
  styleUrls: ['./property-view.component.scss']
})
export class PropertyViewComponent implements OnInit {

    @ViewChild('displayEdit', { static: false}) displayEditComponent: DisplayEditComponent;
    @ViewChild('addValue', { static: false}) addValueComponent: AddValueComponent;
    /**
     * Parent resource
     *
     * @param (resource)
     */
    @Input() parentResource: ReadResource;

    /**
     * Array of property object with ontology class prop def, list of properties and corresponding values
     *
     * @param (propArray)
     */
    @Input() propArray: PropertyInfoValues[];

    /**
     * Array of system property object with list of system properties
     *
     * @param (propArray)
     */
    @Input() systemPropArray: SystemPropertyDefinition[];

    addButtonIsVisible: boolean; // used to toggle add value button
    addValueFormIsVisible: boolean; // used to toggle add value form field
    newValue: ReadValue;

    constants = Constants;

    constructor() { }

    ngOnInit() {
        if (this.parentResource) {
            // get user permissions
            const allPermissions = PermissionUtil.allUserPermissions(
                this.parentResource.userHasPermission as 'RV' | 'V' | 'M' | 'D' | 'CR'
            );

            // if user has modify permissions, set createAllowed to true so the user see's the add button
            this.addButtonIsVisible = allPermissions.indexOf(PermissionUtil.Permissions.M) !== -1;
        }

        console.log(this.propArray);

    }

    /**
     * Called from the template when the user clicks on the add button
     */
    showAddValueForm(prop: PropertyInfoValues) {
        this.newValue = this.getNewValueType(prop.propDef.objectType);

        // TODO: get user permission level
        this.newValue.userHasPermission = this.parentResource.userHasPermission;

        this.newValue.type = prop.propDef.objectType;
        this.newValue.id = prop.propDef.id;

        this.addValueFormIsVisible = true;
        this.addButtonIsVisible = false;

        console.log('prop: ', prop);
        console.log('newValue: ', this.newValue);
    }

    /**
     * Called from the template when the user clicks on the cancel button
     */
    hideAddValueForm(emitterMessage?: string) {
        this.addValueFormIsVisible = false;
        this.addButtonIsVisible = true;
    }

    /**
     * Determines the correct ReadValue type
     * For complex values, it must be the exact value type
     * For simple values, ReadValue is enough
     *
     * @param value object type
     */
    getNewValueType(value: string): ReadValue {
        switch (value) {
            case this.constants.ColorValue:
                const newReadColorValue = new ReadColorValue();
                newReadColorValue.color = '#ffffff';
                return newReadColorValue;
            case this.constants.DateValue:
                // Initialize a new ParseReadDateValue as it is required to initialize a new ReadDateValue
                const newParseReadDateValue = new ParseReadDateValue();

                // Set the default date for a new value
                const knoraDate = new KnoraDate('GREGORIAN', 'CE', 1971, 1, 1);

                // Setting the start and end properties to the same value ensure it will be a single date
                // If the start and end properties are different, it will be considered a date period
                newParseReadDateValue.calendar = knoraDate.calendar;
                newParseReadDateValue.startEra = knoraDate.era;
                newParseReadDateValue.endEra = knoraDate.era;
                newParseReadDateValue.startYear = knoraDate.year;
                newParseReadDateValue.endYear = knoraDate.year;
                newParseReadDateValue.startMonth = knoraDate.month;
                newParseReadDateValue.endMonth = knoraDate.month;
                newParseReadDateValue.startDay = knoraDate.day;
                newParseReadDateValue.endDay = knoraDate.day;

                return new ReadDateValue(newParseReadDateValue);
            case this.constants.IntervalValue:
                const newReadIntervalValue = new ReadIntervalValue();
                newReadIntervalValue.start = 0;
                newReadIntervalValue.end = 1;
                return newReadIntervalValue;
            case this.constants.TimeValue:
                const newReadTimeValue = new ReadTimeValue();
                newReadTimeValue.time = '1971-01-01T00:00:00.000Z';
                return newReadTimeValue;
            default:
                return new ReadValue();
        }
    }
}
