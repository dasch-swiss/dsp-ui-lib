import { Component, OnInit, ViewChild, Input, AfterViewInit, OnChanges } from '@angular/core';
import { DisplayEditComponent } from '../../operations/display-edit/display-edit.component';
import { PropertyInfoValues } from '../resource-view/resource-view.component';
import { ReadResource, SystemPropertyDefinition, ReadValue, PermissionUtil } from '@dasch-swiss/dsp-js';
import { AddValueComponent } from '../../operations/add-value/add-value.component';

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

    showAddValueForm(prop: PropertyInfoValues) {
        this.newValue = new ReadValue();

        // TODO: get user permission level
        this.newValue.userHasPermission = this.parentResource.userHasPermission;

        this.newValue.type = prop.propDef.objectType;
        this.newValue.id = prop.propDef.id;

        this.addValueFormIsVisible = true;
        this.addButtonIsVisible = false;
        console.log('prop: ', prop);
        console.log('newValue: ', this.newValue);
    }

    hideAddValueForm(emitterMessage?: string) {
        this.addValueFormIsVisible = false;
        this.addButtonIsVisible = true;
    }

}
