import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ApiResponseData, KnoraApiConnection, LoginResponse, ReadResource, ReadValue, ReadTextValueAsHtml} from '@knora/api';
import {mergeMap} from 'rxjs/operators';
import {DisplayEditComponent} from 'knora-ui/lib/viewer/operations/display-edit/display-edit.component';
import {KnoraApiConnectionToken} from 'knora-ui';

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
        this.testValue = new ReadTextValueAsHtml();
        this.testValue.hasPermissions = "CR knora-admin:Creator|M knora-admin:ProjectMember|V knora-admin:KnownUser|RV knora-admin:UnknownUser";
        this.testValue.userHasPermission = "CR";
        console.log(this.testValue);
      }
    );

  }

}
