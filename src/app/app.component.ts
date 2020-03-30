import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ApiResponseData, KnoraApiConnection, LoginResponse, ReadResource, ReadValue, CardinalityUtil, ResourceClassDefinition, CreateTextValueAsString, UpdateResource, CreateValue, WriteValueResponse, ReadTextValueAsString } from '@knora/api';
import { KnoraApiConnectionToken } from 'knora-ui';
import { DisplayEditComponent } from 'knora-ui/lib/viewer/operations/display-edit/display-edit.component';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('displayEdit', { static: false }) displayEditComponent: DisplayEditComponent;

  title = 'knora-ui-ng-lib';

  testthing: ReadResource;
  testValue: ReadValue;

  values: ReadValue[];

  createAllowed: boolean;
  createMode: boolean;
  createValue: ReadValue;

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
      (resource: ReadResource) => {
        this.testthing = resource;
        console.log(this.testthing);

        this.values = this.testthing.getValues('http://0.0.0.0:3333/ontology/0001/anything/v2#hasText');

        console.log('values: ', this.values);
        this.testValue = this.testthing.getValues('http://0.0.0.0:3333/ontology/0001/anything/v2#hasText')[0];

        this.createAllowed = CardinalityUtil.createValueForPropertyAllowed(this.testValue.property, 1, this.testthing.entityInfo.classes[this.testthing.type] as ResourceClassDefinition);
      }
    );

  }

  showNewValueForm() {
    this.createValue = new ReadValue();
    this.createValue.userHasPermission = 'CR';
    this.createValue.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
    
    this.createMode = true;
    this.createAllowed = false;
  }

  hideNewValueForm(b: boolean) {
    this.createMode = false;
    this.createAllowed = true;
  }

  onValueAdded() {
    this.knoraApiConnection.v2.auth.login('username', 'root', 'test').pipe(
      mergeMap(
        (loginResponse: ApiResponseData<LoginResponse>) => {
          return this.knoraApiConnection.v2.res.getResource('http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw');
        }
      )
    ).subscribe(
      (resource: ReadResource) => {
        this.testthing = resource;
        console.log(this.testthing);

        this.values = this.testthing.getValues('http://0.0.0.0:3333/ontology/0001/anything/v2#hasText');
        console.log('values: ', this.values);

        this.createMode = false;
        this.createAllowed = true;
      }
    );
  }

}
