import {
    Component,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    ApiResponseError,
    IHasPropertyWithPropertyDefinition,
    KnoraApiConnection,
    PropertyDefinition,
    ReadResource,
    ReadValue,
    SystemPropertyDefinition
} from '@dasch-swiss/dsp-js';
import { Subscription } from 'rxjs';
import { DspApiConnectionToken } from '../../../core/core.module';
import { Events, ValueOperationEventService } from '../../services/value-operation-event.service';


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

    resource: ReadResource;

    resPropInfoVals: PropertyInfoValues[] = []; // array of resource properties

    systemPropDefs: SystemPropertyDefinition[] = []; // array of system properties

    versionArkUrl: string; // versionArkUrl value
    message: string; // message to show in the snackbar to confirm the copy of the ARK URL
    action: string; // label for the snackbar action

    valueOperationEventSubscription: Subscription;

    constructor(
        @Inject(DspApiConnectionToken) private _dspApiConnection: KnoraApiConnection,
        private _snackBar: MatSnackBar,
        private _valueOperationEventService: ValueOperationEventService) { }

    ngOnInit() {
        // subscribe to the event bus and listen for the ValueAdded event to be emitted
        // when a ValueAdded event is emitted, get the resource again to display the newly created value
        this.valueOperationEventSubscription = this._valueOperationEventService.on(
            Events.ValueAdded, (newValue: ReadValue) => this.updateResource(newValue));
    }

    ngOnChanges() {
        this.getResource(this.iri);
    }

    ngOnDestroy() {
        // unsubscribe from the event bus when component is destroyed
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

                // set the arkUrl value
                this.versionArkUrl = this.resource.versionArkUrl;

            },
            (error: ApiResponseError) => {
                console.error('Error to get resource: ', error);
            });
    }

    updateResource(newValue?: ReadValue, isDeletion?: boolean): void {
        if (this.resPropInfoVals) {
            if (!isDeletion) {
                this.resPropInfoVals
                    .filter( propInfoValueArray => propInfoValueArray.propDef.id === newValue.property) // filter to the correct property
                    .map( propInfoValue => propInfoValue.values.push(newValue)); // push new property to array
            } else {
                // pop from the array
                // TODO: remove element from array when deletion is implemented
            }
        } else {
            console.error('No properties exist for this resource');
        }
    }

    /**
     * Display message to confirm the copy of the citation link (ARK URL)
     * @param message
     * @param action
     */
    openSnackBar(message: string, action: string) {
        message = 'Copied to clipboard!';
        action = 'Citation Link';
        this._snackBar.open(message, action, {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
        });
    }

}
