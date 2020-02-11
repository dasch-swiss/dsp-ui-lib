import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiResponseData, KnoraApiConfig, KnoraApiConnection, LoginResponse, ReadIntValue, ReadResource, ReadValue} from '@knora/api';
import {mergeMap} from 'rxjs/operators';
import {DisplayEditComponent} from 'knora-ui/lib/viewer/operations/display-edit/display-edit.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('displayEdit', {static: false}) displayEditComponent: DisplayEditComponent;

  title = 'knora-ui-ng-lib';

  testthing: ReadResource;
  testValue: ReadValue;

  knoraApiConnection: KnoraApiConnection;

  ngOnInit(): void {

    const config = new KnoraApiConfig('http', '0.0.0.0', 3333, undefined, undefined, true);
    this.knoraApiConnection = new KnoraApiConnection(config);

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
        this.testValue = this.testthing.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger', ReadIntValue)[0];
      }
    );

  }


}
