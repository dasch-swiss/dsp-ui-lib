import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
    PermissionUtil,
    ReadResource,
    SystemPropertyDefinition
} from '@dasch-swiss/dsp-js';
import { AddValueComponent } from '../../operations/add-value/add-value.component';
import { DisplayEditComponent } from '../../operations/display-edit/display-edit.component';
import { PropertyInfoValues } from '../resource-view/resource-view.component';
import { ValueTypeService } from '../../services/value-type.service';
import { EventBusService, Events } from '../../services/event-bus.service';
import { Subscription } from 'rxjs';

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
    propID: string; // used in template to show only the add value form of the corresponding value
    readOnlyProp: boolean; // used in template to not show an "add" button for properties we do not yet have a way to create/edit

    eventBusSubscription: Subscription;

    constructor(private valueTypeService: ValueTypeService,
                private eventBusService: EventBusService) { }

    ngOnInit() {
        if (this.parentResource) {
            // get user permissions
            const allPermissions = PermissionUtil.allUserPermissions(
                this.parentResource.userHasPermission as 'RV' | 'V' | 'M' | 'D' | 'CR'
            );

            // if user has modify permissions, set createAllowed to true so the user see's the add button
            this.addButtonIsVisible = allPermissions.indexOf(PermissionUtil.Permissions.M) !== -1;
        }

        this.eventBusSubscription = this.eventBusService.on(Events.ValueAdded, () => this.hideAddValueForm());

        console.log('resource: ', this.parentResource);

        console.log(this.propArray);

    }

    /**
     * Called from the template when the user clicks on the add button
     */
    showAddValueForm(prop: PropertyInfoValues) {

        this.propID = prop.propDef.id;
        this.addValueFormIsVisible = true;
        this.addButtonIsVisible = false;
        console.log('prop: ', prop);
        console.log('propID ', this.propID);

    }

    /**
     * Called from the template when the user clicks on the cancel button
     */
    hideAddValueForm() {
        this.addValueFormIsVisible = false;
        this.addButtonIsVisible = true;
    }
}
