import { Component, Inject, Input, OnChanges, OnInit, OnDestroy } from '@angular/core';
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
import { EventBusService, Events } from '../../services/event-bus.service';
import { mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';


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
export class ResourceViewComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * Resource iri
   *
   * @param [iri] Resource iri
   */
  @Input() iri: string;

  resource: ReadResource;

  propArray: PropertyInfoValues[] = []; // resource property

  systemPropArray: PropertyDefinition[] = []; // system property

  eventBusSubscription: Subscription;

  constructor(@Inject(KnoraApiConnectionToken)
              private knoraApiConnection: KnoraApiConnection,
              public eventBusService : EventBusService
  ) { }

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
   * @param resource Resource
   */
  getResource(iri: string): void {
    // TODO: add this.createAllowed = CardinalityUtil.createValueForPropertyAllowed(this.testValue.property, 1, this.testthing.entityInfo.classes[this.testthing.type] as ResourceClassDefinition);

    this.knoraApiConnection.v2.auth.login('username', 'root', 'test').pipe(
      mergeMap(
        (loginResponse: ApiResponseData<LoginResponse>) => {
          // this.resource = new ReadResource();
          this.propArray = [];
          this.systemPropArray = [];
          return this.knoraApiConnection.v2.res.getResource(iri);
        }
      )
    ).subscribe(
      (response: ReadResource) => {
        this.resource = response;
        console.log(this.resource);

        // get list of all properties
        const propsList: IHasProperty[] = this.resource.entityInfo.classes[this.resource.type].propertiesList;
        console.log('propsList: ', propsList);
        
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
        console.log('propArray: ', this.propArray);
        console.log('systemPropArray: ', this.systemPropArray);
      },
      (error: ApiResponseError) => {
        console.error('Error to get resource: ', error);
      });      
  }

}
