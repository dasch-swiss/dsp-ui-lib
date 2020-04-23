import { Component, Inject, OnInit } from '@angular/core';
import {
  KnoraApiConnection,
  ApiResponseError,
  ApiResponseData,
  LoginResponse
} from '@knora/api';
import {KnoraApiConnectionToken} from 'knora-ui';

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss']
})
export class ModifyComponent implements OnInit {

  resourceIri: string;
  loading: boolean;

  constructor(@Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection) { }

  ngOnInit(): void {
    this.loading = true;
    this.knoraApiConnection.v2.auth.login('username', 'root', 'test').subscribe(
      (response: ApiResponseData<LoginResponse>) => {
        console.log('User logged in successfully: ', response);
        this.resourceIri = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';
        this.loading = false;
      },
      (error: ApiResponseError) => {
        console.log('User failed to log in');
      }
    );
  }

}
