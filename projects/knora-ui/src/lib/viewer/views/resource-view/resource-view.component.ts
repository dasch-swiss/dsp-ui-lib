import { Component, Inject, Input, OnChanges, OnInit } from '@angular/core';
import {
  IHasProperty,
  KnoraApiConnection,
  PropertyDefinition,
  ReadResource,
  ReadValue,
  ResourcePropertyDefinition,
  ApiResponseError,
  SystemPropertyDefinition,
  ApiResponseData,
  LoginResponse
} from '@knora/api';
import { KnoraApiConnectionToken } from '../../../core/core.module';
import { mergeMap } from 'rxjs/operators';


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
  @Input() iri: string;

  resource: ReadResource;

  propArray: PropertyInfoValues[] = []; // resource property

  systemPropArray: PropertyDefinition[] = []; // system property

  constructor(@Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection) { }

  ngOnInit() {

  }

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
        this.getResourceProperties(response);
      },
      (error: ApiResponseError) => {
        console.error('Error to get resource: ', error);
      });
  }

  getResourceProperties(response: ReadResource) : void {
    this.resource = response;
    // console.log(this.resource);

    // get list of all properties
    const propsList: IHasProperty[] = this.resource.entityInfo.classes[this.resource.type].propertiesList;

    for (const prop of propsList) {
      const index = prop.propertyIndex;

      if (this.resource.entityInfo.properties[index]) {
        if (this.resource.entityInfo.properties[index] instanceof ResourcePropertyDefinition) {
          // filter all properties by type ResourcePropertyDefinition
          const propInfoAndValues: PropertyInfoValues = {
            guiDef: prop,
            propDef: this.resource.entityInfo.properties[index],
            values: this.resource.properties[index]
          };

          this.propArray.push(propInfoAndValues);

        } else if (this.resource.entityInfo.properties[index] instanceof SystemPropertyDefinition) {
          // filter all properties by type SystemPropertyDefinition
          const systemPropInfo = this.resource.entityInfo.properties[index];

          this.systemPropArray.push(systemPropInfo);

        }

      } else {
        console.error('Error detected: the property with IRI =' + index + 'is not a property of the resource');
      }
    }

    // sort properties by guiOrder
    this.propArray.sort((a, b) => (a.guiDef.guiOrder > b.guiDef.guiOrder) ? 1 : -1);
  }

}
