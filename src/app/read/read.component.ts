import { Component, Inject, OnInit } from '@angular/core';
import { DspApiConfigToken, DspApiConnectionToken } from '@dasch-swiss/dsp-ui';
import {
    ApiResponseData,
    ApiResponseError, KnoraApiConfig,
    KnoraApiConnection,
    LogoutResponse
} from '@dasch-swiss/dsp-js';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class ReadComponent implements OnInit {

  resourceIri: string;
  loading: boolean;

  constructor(@Inject(DspApiConnectionToken) private knoraApiConnection: KnoraApiConnection,
              @Inject(DspApiConfigToken) private knoraApiConfig: KnoraApiConfig) {
  }

  ngOnInit(): void {
      console.log('read component', this.knoraApiConnection, this.knoraApiConfig);
    this.loading = true;
    this.knoraApiConnection.v2.auth.logout().subscribe(
      (response: ApiResponseData<LogoutResponse>) => {
        this.resourceIri = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';
        this.loading = false;
      },
      (error: ApiResponseError) => {
          console.error(error);
      }
  );
  }

}
