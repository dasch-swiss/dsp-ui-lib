import { Component, Inject, Input, OnChanges, OnInit } from '@angular/core';
import { IHasProperty, KnoraApiConnection, PropertyDefinition, ReadResource, ReadValue, ResourcePropertyDefinition, ApiResponseError } from '@knora/api';
import { KnoraApiConnectionToken } from '../../../core/core.module';


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
export class ResourceViewComponent implements OnInit, OnChanges {

  /**
   * Resource iri
   *
   * @param [iri] Resource iri
   */
  @Input() iri?: string;

  resource: ReadResource;

  propArray: PropertyInfoValues[] = [];

  constructor(@Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection) { }

  ngOnInit() {
    console.log('iri on init', this.iri);
    // this.getResource(this.iri);
  }

  ngOnChanges() {
    console.log('iri on changes', this.iri);
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
          } else {
            console.error('Error');
          }
          i++;
        }

        // sort properties by guiOrder
        this.propArray.sort((a, b) => (a.guiDef.guiOrder > b.guiDef.guiOrder) ? 1 : -1);

      },
      (error: ApiResponseError) => {
        console.error('Error to get resource: ', error);
      });
  }

}
