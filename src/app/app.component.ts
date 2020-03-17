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

  resourceIri: string;

  constructor(@Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection) {
  }

  ngOnInit(): void {
    this.resourceIri = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';
  }

}
