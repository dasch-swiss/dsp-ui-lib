import { Component, Inject, Input, OnChanges } from '@angular/core';
import { IHasProperty, KnoraApiConnection, ReadResource, ReadValue, ResourcePropertyDefinition } from '@knora/api';
import { PropertyDefinition } from '@knora/api/src/models/v2/ontologies/property-definition';
import { KnoraApiConnectionToken } from '../../../core';

// object of property information from ontology class, properties and property values
export interface PropertyInfoValues {
  guiDef: IHasProperty;
  propDef: PropertyDefinition;
  values: ReadValue[];
}

@Component({
  selector: 'kui-resource-view',
  templateUrl: './resource-view.component.html',
  styleUrls: ['./resource-view.component.scss']
})
export class ResourceViewComponent implements OnChanges {

  /**
   * Resource iri
   *
   * @param [iri] Resource iri
   */
  @Input() iri?: string;

  resource: ReadResource;

  propArray: PropertyInfoValues[] = [];

  constructor(@Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection) { }

  ngOnChanges() {
    this.getResource(this.iri);
  }

  /**
   * Get a read resource sequence with ontology information and incoming resources.
   *
   * @param iri Resource iri
   */
  getResource(iri: string): void {
    this.knoraApiConnection.v2.res.getResource(iri).subscribe(
      (response: ReadResource) => {
        this.resource = response;
        const propsList: IHasProperty[] = this.resource.entityInfo.classes[this.resource.type].propertiesList;

        let i = 0;
        for (const prop of propsList) {
          const index = prop.propertyIndex;

          if (this.resource.entityInfo.properties[index] &&
            this.resource.entityInfo.properties[index] instanceof ResourcePropertyDefinition) {

            const propInfoAndValues: PropertyInfoValues = {
              guiDef: prop,
              propDef: this.resource.entityInfo.properties[index],
              values: this.resource.properties[index]
            };

            this.propArray.push(propInfoAndValues);
          }
          i++;
        }

        // sort properties by guiOrder
        this.propArray.sort((a, b) => (a.guiDef.guiOrder > b.guiDef.guiOrder) ? 1 : -1);

      });
  }

}
