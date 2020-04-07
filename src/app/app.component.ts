import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ApiResponseData, IHasProperty, KnoraApiConnection, LoginResponse, ReadResource, ReadValue, ResourcePropertyDefinition } from '@knora/api';
import { PropertyDefinition } from '@knora/api/src/models/v2/ontologies/property-definition';
import { KnoraApiConnectionToken } from 'knora-ui';
import { DisplayEditComponent } from 'knora-ui/lib/viewer/operations/display-edit/display-edit.component';
import { mergeMap } from 'rxjs/operators';

// object of property information from ontology class, properties and property values
export interface PropertyInfoValues {
  guiDef: IHasProperty;
  propDef: PropertyDefinition;
  values: ReadValue[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('displayEdit', { static: false }) displayEditComponent: DisplayEditComponent;

  title = 'knora-ui-ng-lib';

  resource: ReadResource;
  value: ReadValue;
  propArray: PropertyInfoValues[] = [];

  constructor(@Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection) {
  }

  ngOnInit(): void {

    this.knoraApiConnection.v2.auth.login('username', 'root', 'test').pipe(
      mergeMap(
        (loginResponse: ApiResponseData<LoginResponse>) => {
          return this.knoraApiConnection.v2.res.getResource('http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw');
        }
      )
    ).subscribe(
      (res: ReadResource) => {
        this.resource = res;
        // console.log(this.resource);
        const propsList: IHasProperty[] = this.resource.entityInfo.classes[this.resource.type].propertiesList;

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

        }

        // sort properties by guiOrder
        this.propArray.sort((a, b) => (a.guiDef.guiOrder > b.guiDef.guiOrder) ? 1 : -1);

      });
  }
}