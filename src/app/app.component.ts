import { Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ApiResponseData, KnoraApiConnection, LoginResponse, ReadResource, ReadValue, CardinalityUtil, ResourceClassDefinition, CreateTextValueAsString, UpdateResource, CreateValue, WriteValueResponse, ReadTextValueAsString } from '@knora/api';
import { KnoraApiConnectionToken } from 'knora-ui';
import { DisplayEditComponent } from 'knora-ui/lib/viewer/operations/display-edit/display-edit.component';
import { mergeMap } from 'rxjs/operators';
import { AddValueComponent } from 'knora-ui/lib/viewer/operations/add-value/add-value.component';
import { EventBusService, Events } from 'projects/knora-ui/src/lib/viewer/services/event-bus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('displayEdit', { static: false }) displayEditComponent: DisplayEditComponent;
  @ViewChild('addValue', { static: false }) addValueComponent: AddValueComponent;

  eventbusSub: Subscription;
  
  testthing: ReadResource;
  testValue: ReadValue;

  values: ReadValue[];

  createAllowed: boolean; // used to toggle add value button
  createMode: boolean; // used to toggle add value form field
  newValue: ReadValue;

  constructor(@Inject(KnoraApiConnectionToken)
              private knoraApiConnection: KnoraApiConnection,
              private eventBusService : EventBusService) {
  }

  ngOnInit(): void {
    this.getValues();
    this.eventbusSub = this.eventBusService.on(Events.ValueAdded, temp => (console.log(temp)));
    console.log('eventbusSub: ', this.eventbusSub);
  }

  ngOnDestroy(): void {
    this.eventbusSub.unsubscribe();
  }

  showAddValueForm() {
    this.newValue = new ReadValue();

    // TODO: get user permission level
    this.newValue.userHasPermission = 'CR';

    // TODO: change this to use the correct type for the corresponding value
    this.newValue.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
    
    this.createMode = true;
    this.createAllowed = false;
  }

  hideAddValueForm(emitterMessage?: string) {
    this.createMode = false;
    this.createAllowed = true;
  }

  getValues(emitterMessage?: string) {
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
        
        // TODO: move this somewhere else so that it is correctly evaluated for the corresponding property
        this.createAllowed = CardinalityUtil.createValueForPropertyAllowed(this.values[0].property, 1, this.testthing.entityInfo.classes[this.testthing.type] as ResourceClassDefinition);
      }
    );
  }
}
