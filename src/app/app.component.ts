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
  createValue: ReadTextValueAsString;

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

  showNewValueForm(){
    this.createValue = new ReadTextValueAsString();
    this.createValue.hasPermissions = 'M';
    this.createValue.userHasPermission = 'CR';
    this.createValue.type = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText';
    this.createValue.text = "hello";
  
    console.log('createValue: ', this.createValue);
    
    this.createMode = true;
    this.createAllowed = false;
  }

  createNewValue() {
    const createVal = new CreateTextValueAsString();
    createVal.text = new Date().toLocaleString();
    createVal.valueHasComment = 'created comment';

    const updateRes = new UpdateResource();
    updateRes.type = this.testthing.type;
    updateRes.id = this.testthing.id;
    updateRes.property = this.testValue.property;
    updateRes.value = createVal;

    console.log('updateRes: ', updateRes);

    this.knoraApiConnection.v2.values.createValue(updateRes as UpdateResource<CreateValue>).pipe(
      mergeMap((res: WriteValueResponse) => {
        console.log(res);
        return this.knoraApiConnection.v2.values.getValue(this.testthing.id, this.testValue.uuid);
      })
    ).subscribe(
      (res2: ReadResource) => {
        console.log('beep');
        console.log(this.testthing);

        this.values = this.testthing.getValues('http://0.0.0.0:3333/ontology/0001/anything/v2#hasText');

        console.log('new values: ', this.values);
        //console.log(res2);
        //this.displayValue = res2.getValues(this.displayValue.property)[0];
        //this.mode = 'read';
      }
    );

    
  }

}
