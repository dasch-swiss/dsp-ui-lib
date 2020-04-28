import { Component, Inject, OnInit } from '@angular/core';
import {
  KnoraApiConnection,
  ApiResponseError,
  ApiResponseData,
  LogoutResponse
} from '@knora/api';
import {KnoraApiConnectionToken} from '@knora/ui';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class ReadComponent implements OnInit {

  resourceIri: string;
  loading: boolean;

  constructor(@Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection) {
  }

  ngOnInit(): void {
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
