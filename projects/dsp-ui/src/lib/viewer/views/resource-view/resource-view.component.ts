import {
    Component,
    EventEmitter, Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {
    ApiResponseError,
    Constants,
    DeleteValue,
    IHasPropertyWithPropertyDefinition,
    KnoraApiConnection,
    PropertyDefinition,
    ReadProject,
    ReadResource,
    ReadValue,
    SystemPropertyDefinition
} from '@dasch-swiss/dsp-js';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../action';
import { DspApiConnectionToken } from '../../../core/core.module';
import {
    AddedEventValue,
    DeletedEventValue,
    Events,
    UpdatedEventValues,
    ValueOperationEventService
} from '../../services/value-operation-event.service';
import { ValueService } from '../../services/value.service';

// object of property information from ontology class, properties and property values
export interface PropertyInfoValues {
    guiDef: IHasPropertyWithPropertyDefinition;
    propDef: PropertyDefinition;
    values: ReadValue[];
}

@Component({
    selector: 'dsp-resource-view',
    templateUrl: './resource-view.component.html',
    styleUrls: ['./resource-view.component.scss'],
    providers: [ValueOperationEventService] // provide service on the component level so that each implementation of this component has its own instance.
})
export class ResourceViewComponent implements OnInit, OnChanges, OnDestroy {

    /**
     * Resource iri
     *
     * @param [iri] Resource iri
     */
    @Input() iri: string;

    /**
     * Show all properties, even they don't have a value.
     *
     * @param  (showAllProps)
     */
    @Input() showAllProps = false;

    /**
     * Show toolbar with project info and some action tools on top of properties if true.
     *
     * @param  (showToolbar)
     */
    @Input() showToolbar = true;

    /**
     * @param  openProject EventEmitter which sends project information to parent component
     */
    @Output() openProject: EventEmitter<ReadProject> = new EventEmitter<ReadProject>();

    resource: ReadResource;

    resPropInfoVals: PropertyInfoValues[] = []; // array of resource properties

    systemPropDefs: SystemPropertyDefinition[] = []; // array of system properties

    valueOperationEventSubscriptions: Subscription[] = []; // array of ValueOperationEvent subscriptions

    constructor(
        @Inject(DspApiConnectionToken) private _dspApiConnection: KnoraApiConnection,
        private _notification: NotificationService,
        private _valueOperationEventService: ValueOperationEventService,
        private _valueTypeService: ValueService) { }

    ngOnInit() {
        // subscribe to the ValueOperationEventService and listen for an event to be emitted
        this.valueOperationEventSubscriptions.push(this._valueOperationEventService.on(
            Events.ValueAdded, (newValue: AddedEventValue) =>
                this.addValueToResource(newValue.addedValue)));

        this.valueOperationEventSubscriptions.push(this._valueOperationEventService.on(
            Events.ValueUpdated, (updatedValue: UpdatedEventValues) =>
                this.updateValueInResource(updatedValue.currentValue, updatedValue.updatedValue)));

        this.valueOperationEventSubscriptions.push(this._valueOperationEventService.on(
            Events.ValueDeleted, (deletedValue: DeletedEventValue) =>
                this.deleteValueFromResource(deletedValue.deletedValue)));

    }

    ngOnChanges() {
        this.getResource(this.iri);
    }

    ngOnDestroy() {
        // unsubscribe from the ValueOperationEventService when component is destroyed
        if (this.valueOperationEventSubscriptions !== undefined) {
            this.valueOperationEventSubscriptions.forEach(sub => sub.unsubscribe());
        }
    }

    /**
     * Get a read resource sequence with ontology information and incoming resources.
     *
     * @param iri resourceIri
     */
    getResource(iri: string): void {

        this._dspApiConnection.v2.res.getResource(iri).subscribe(
            (response: ReadResource) => {
                this.resource = response;

                // gather resource property information
                this.resPropInfoVals = this.resource.entityInfo.classes[this.resource.type].getResourcePropertiesList().map(
                    (prop: IHasPropertyWithPropertyDefinition) => {
                        const propInfoAndValues: PropertyInfoValues = {
                            propDef: prop.propertyDefinition,
                            guiDef: prop,
                            values: this.resource.getValues(prop.propertyIndex)
                        };
                        return propInfoAndValues;
                    }
                );

                // sort properties by guiOrder
                this.resPropInfoVals =
                    this.resPropInfoVals
                        .filter(prop => prop.propDef.objectType !== Constants.GeomValue)
                        .sort((a, b) => (a.guiDef.guiOrder > b.guiDef.guiOrder) ? 1 : -1);

                // get system property information
                this.systemPropDefs = this.resource.entityInfo.getPropertyDefinitionsByType(SystemPropertyDefinition);

            },
            (error: ApiResponseError) => {
                this._notification.openSnackBar(error);
            });
    }

    /**
     * Updates the UI in the event of a new value being added to show the new value
     *
     * @param valueToAdd the value to add to the end of the values array of the filtered property
     */
    addValueToResource(valueToAdd: ReadValue): void {
        if (this.resPropInfoVals) {
            this.resPropInfoVals
                .filter(propInfoValueArray =>
                    propInfoValueArray.propDef.id === valueToAdd.property) // filter to the correct property
                .forEach(propInfoValue =>
                    propInfoValue.values.push(valueToAdd)); // push new value to array
        } else {
            console.error('No properties exist for this resource');
        }
    }

    /**
     * Updates the UI in the event of an existing value being updated to show the updated value
     *
     * @param valueToReplace the value to be replaced within the values array of the filtered property
     * @param updatedValue the value to replace valueToReplace with
     */
    updateValueInResource(valueToReplace: ReadValue, updatedValue: ReadValue): void {
        if (this.resPropInfoVals && updatedValue !== null) {
            this.resPropInfoVals
                .filter(propInfoValueArray =>
                    propInfoValueArray.propDef.id === valueToReplace.property) // filter to the correct property
                .forEach(filteredpropInfoValueArray => {
                    filteredpropInfoValueArray.values.forEach((val, index) => { // loop through each value of the current property
                        if (val.id === valueToReplace.id) { // find the value that should be updated using the id of valueToReplace
                            filteredpropInfoValueArray.values[index] = updatedValue; // replace value with the updated value
                        }
                    });
                });
        } else {
            console.error('No properties exist for this resource');
        }
    }

    /**
     * Updates the UI in the event of an existing value being deleted
     *
     * @param valueToDelete the value to remove from the values array of the filtered property
     */
    deleteValueFromResource(valueToDelete: DeleteValue): void {
        if (this.resPropInfoVals) {
            this.resPropInfoVals
                .filter(propInfoValueArray =>  // filter to the correct type
                    this._valueTypeService.compareObjectTypeWithValueType(propInfoValueArray.propDef.objectType, valueToDelete.type))
                .forEach(filteredpropInfoValueArray => {
                    filteredpropInfoValueArray.values.forEach((val, index) => { // loop through each value of the current property
                        if (val.id === valueToDelete.id) { // find the value that was deleted using the id
                            filteredpropInfoValueArray.values.splice(index, 1); // remove the value from the values array
                        }
                    });
                }
            );
        } else {
            console.error('No properties exist for this resource');
        }
    }

    /**
     * Event receiver: Show all props or not
     *
     * @param  show
     */
    toggleProps(show: boolean) {
        this.showAllProps = show;
    }

}
