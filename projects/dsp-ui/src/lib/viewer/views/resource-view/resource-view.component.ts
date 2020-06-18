import {
    Component,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit
} from '@angular/core';
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
import { EventBusService, Events } from '../../services/event-bus.service';


// object of property information from ontology class, properties and property values
export interface PropertyInfoValues {
    guiDef: IHasPropertyWithPropertyDefinition;
    propDef: PropertyDefinition;
    values: ReadValue[];
}

@Component({
  selector: 'dsp-resource-view',
  templateUrl: './resource-view.component.html',
  styleUrls: ['./resource-view.component.scss']
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

    eventBusSubscription: Subscription;

    constructor(@Inject(DspApiConnectionToken)
                private knoraApiConnection: KnoraApiConnection,
                public eventBusService: EventBusService) { }


    ngOnInit() {
        this.eventBusSubscription = this.eventBusService.on(Events.ValueAdded, () => this.getResource(this.iri));
        this.eventBusSubscription = this.eventBusService.on(Events.ValueDeleted, () => this.getResource(this.iri));
    }

    ngOnChanges() {
        this.getResource(this.iri);
    }

    ngOnDestroy() {
        this.eventBusSubscription.unsubscribe();
    }

    /**
     * Get a read resource sequence with ontology information and incoming resources.
     *
     * @param iri resourceIri
     */
    getResource(iri: string): void {
        // TODO: add this.createAllowed = CardinalityUtil.createValueForPropertyAllowed(this.testValue.property, 1, this.testthing.entityInfo.classes[this.testthing.type] as ResourceClassDefinition);

        this.knoraApiConnection.v2.res.getResource(iri).subscribe(
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

}
