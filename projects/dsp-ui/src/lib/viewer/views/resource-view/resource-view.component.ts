import { Component, Inject, Input, OnChanges } from '@angular/core';
import {
    ApiResponseError,
    IHasPropertyWithPropertyDefinition,
    KnoraApiConnection,
    PropertyDefinition,
    ReadResource,
    ReadValue,
    SystemPropertyDefinition
} from '@knora/api';
import { DspApiConnectionToken } from '../../../core/core.module';


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
export class ResourceViewComponent implements OnChanges {

  /**
   * Resource iri
   *
   * @param [iri] Resource iri
   */
  @Input() iri: string;

  resource: ReadResource;

  resPropInfoVals: PropertyInfoValues[] = []; // array of resource properties

  systemPropDefs: SystemPropertyDefinition[] = []; // array of system properties

  constructor(@Inject(DspApiConnectionToken) private knoraApiConnection: KnoraApiConnection) { }

  ngOnChanges() {
    this.getResource(this.iri);
  }

  /**
   * Get a read resource sequence with ontology information and incoming resources.
   *
   * @param resource Resource
   */
  getResource(iri: string): void {

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
