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
    BaseValue,
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
import { DspApiConnectionToken } from '../../../core/core.module';
import { Events, EventValues, ValueOperationEventService } from '../../services/value-operation-event.service';


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

    valueOperationEventSubscription: Subscription;

    constructor(
        @Inject(DspApiConnectionToken) private _dspApiConnection: KnoraApiConnection,
        private _valueOperationEventService: ValueOperationEventService) { }

    ngOnInit() {
        // subscribe to the ValueOperationEventService and listen for an event to be emitted
        this.valueOperationEventSubscription = this._valueOperationEventService.on(
            Events.ValueAdded, (newValue: EventValues) => this.updateResource(newValue.currentValue, 'create'));

        this.valueOperationEventSubscription = this._valueOperationEventService.on(
            Events.ValueUpdated, (updatedValue: EventValues) =>
                this.updateResource(updatedValue.currentValue, 'update', updatedValue.newValue));

        this.valueOperationEventSubscription = this._valueOperationEventService.on(
            Events.ValueDeleted, (deletedValue: EventValues) => this.updateResource(deletedValue.currentValue, 'delete'));

    }

    ngOnChanges() {
        this.getResource(this.iri);
    }

    ngOnDestroy() {
        // unsubscribe from the ValueOperationEventService when component is destroyed
        if (this.valueOperationEventSubscription !== undefined) {
            this.valueOperationEventSubscription.unsubscribe();
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
                this.resPropInfoVals.sort((a, b) => (a.guiDef.guiOrder > b.guiDef.guiOrder) ? 1 : -1);

                // get system property information
                this.systemPropDefs = this.resource.entityInfo.getPropertyDefinitionsByType(SystemPropertyDefinition);

            },
            (error: ApiResponseError) => {
                console.error('Error to get resource: ', error);
            });
    }

    /**
     * Update the UI to reflect updates made to property values.
     *
     * @param currentValue value to be updated inside propInfoValueArray
     * @param isDeletion is the value being removed or added
     */
    updateResource(currentValue: BaseValue, operation: 'create' | 'update' | 'delete', newValue?: BaseValue): void {
        if (this.resPropInfoVals) {
            if (operation === 'create') { // add new value
                this.resPropInfoVals
                    .filter( propInfoValueArray =>
                        propInfoValueArray.propDef.id === (currentValue as ReadValue).property) // filter to the correct property
                    .map( propInfoValue =>
                        propInfoValue.values.push((currentValue as ReadValue))); // push new value to array
            } else if (operation === 'update') { // update value
                this.resPropInfoVals
                    .filter( propInfoValueArray =>
                        propInfoValueArray.propDef.id === (currentValue as ReadValue).property) // filter to the correct property
                    .map((filteredpropInfoValueArray) => {
                        let index = 0;
                        filteredpropInfoValueArray.values.forEach( // loop through each value of the current property
                            val => {
                                if (val.id === (currentValue as ReadValue).id) { // find the value that was deleted using the value id
                                    filteredpropInfoValueArray.values[index] = newValue as ReadValue;
                                }
                                index += 1;
                            }
                        );
                    }
                );
            } else { // delete value
                this.resPropInfoVals
                    .filter( propInfoValueArray =>
                        propInfoValueArray.propDef.objectType === (currentValue as DeleteValue).type) // filter to the correct type
                    .map((filteredpropInfoValueArray) => {
                        let index = 0; // init index to increment and use for the splice
                        filteredpropInfoValueArray.values.forEach( // loop through each value of the current property
                            val => {
                                if (val.id === (currentValue as DeleteValue).id) { // find the value that was deleted using the value id
                                    filteredpropInfoValueArray.values.splice(index, 1); // remove the value from the values array
                                }
                                index += 1; // increment index
                            }
                        );
                    }
                );
            }
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
