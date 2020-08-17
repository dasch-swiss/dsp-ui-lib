import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { PermissionUtil, ReadResource, SystemPropertyDefinition } from '@dasch-swiss/dsp-js';
import { Subscription } from 'rxjs';
import { AddValueComponent } from '../../operations/add-value/add-value.component';
import { DisplayEditComponent } from '../../operations/display-edit/display-edit.component';
import { Events, ValueOperationEventService } from '../../services/value-operation-event.service';
import { PropertyInfoValues } from '../resource-view/resource-view.component';

@Component({
  selector: 'dsp-property-view',
  templateUrl: './property-view.component.html',
  styleUrls: ['./property-view.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    // https://www.kdechant.com/blog/angular-animations-fade-in-and-fade-out
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade in when created.
      transition(':enter', [
        // the styles start from this point when the element appears
        style({opacity: 0}),
        // and animate toward the "in" state above
        animate(300)
      ]),

      // fade out when destroyed.
      transition(':leave',
        // fading out uses a different syntax, with the "style" being passed into animate()
        animate(300, style({opacity: 0})))
    ])
  ]
})
export class PropertyViewComponent implements OnInit, OnDestroy {

    @ViewChild('displayEdit') displayEditComponent: DisplayEditComponent;
    @ViewChild('addValue') addValueComponent: AddValueComponent;
    /**
     * Parent resource
     *
     * @param (parentResource)
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
     * @param (systemPropArray)
     */
    @Input() systemPropArray: SystemPropertyDefinition[];

    /**
     * Show all properties, even if they don't have a value.
     *
     * @param  (showAllProps)
     */
    @Input() showAllProps = false;

    addButtonIsVisible: boolean; // used to toggle add value button
    addValueFormIsVisible: boolean; // used to toggle add value form field
    propID: string; // used in template to show only the add value form of the corresponding value
    readOnlyProp: boolean; // used in template to not show an "add" button for properties we do not yet have a way to create/edit
    showActionBubble = false;
    hoveredProp: string;

    valueOperationEventSubscription: Subscription;

    constructor(private _valueOperationEventService: ValueOperationEventService) { }

    ngOnInit() {
        if (this.parentResource) {
            // get user permissions
            const allPermissions = PermissionUtil.allUserPermissions(
                this.parentResource.userHasPermission as 'RV' | 'V' | 'M' | 'D' | 'CR'
            );

            // if user has modify permissions, set addButtonIsVisible to true so the user see's the add button
            this.addButtonIsVisible = allPermissions.indexOf(PermissionUtil.Permissions.M) !== -1;
        }

        // listen for the AddValue event to be emitted and call hideAddValueForm()
        this.valueOperationEventSubscription = this._valueOperationEventService.on(Events.ValueAdded, () => this.hideAddValueForm());

    }

    ngOnDestroy() {
        // unsubscribe from the event bus when component is destroyed
        if (this.valueOperationEventSubscription !== undefined) {
            this.valueOperationEventSubscription.unsubscribe();
        }
    }

    /**
     * Called from the template when the user clicks on the add button
     */
    showAddValueForm(prop: PropertyInfoValues) {

        this.propID = prop.propDef.id;
        this.addValueFormIsVisible = true;

    }

    /**
     * Called from the template when the user clicks on the cancel button
     */
    hideAddValueForm() {
        this.addValueFormIsVisible = false;
        this.addButtonIsVisible = true;
        this.propID = undefined;
    }

    /**
     * Called from the template when the user hovers over a property label
     */
    mouseEnterActionBubble(prop: PropertyInfoValues) {
        this.hoveredProp = prop.propDef.id;
        this.showActionBubble = true;
    }
    /**
     * Called from the template when the user stops hovering over a property label
     */
    mouseLeaveActionBubble() {
        this.showActionBubble = false;
        this.hoveredProp = undefined;
    }
}
