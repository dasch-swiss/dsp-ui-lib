import { Component, Inject, OnInit } from '@angular/core';
import { ApiResponseData, KnoraApiConnection, LoginResponse, ReadResource } from '@knora/api';
import { KnoraApiConnectionToken } from 'knora-ui';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  iri: string; // resource iri

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
      (response: ReadResource) => {
        console.log('response', response);
        this.iri = response.id;
      }
    );
  }
}
