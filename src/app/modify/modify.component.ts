import { Component, Inject, OnInit } from '@angular/core';
import { DspApiConnectionToken } from '@dasch-swiss/dsp-ui';
import {
    ApiResponseData,
    ApiResponseError,
    KnoraApiConnection,
    LoginResponse,
    ReadLinkValue
} from '@dasch-swiss/dsp-js';

@Component({
    selector: 'app-modify',
    templateUrl: './modify.component.html',
    styleUrls: ['./modify.component.scss']
})
export class ModifyComponent implements OnInit {

    resourceIri: string;
    loading: boolean;

    constructor(@Inject(DspApiConnectionToken) private _dspApiConnection: KnoraApiConnection) { }

    ngOnInit(): void {
        this.loading = true;
        this._dspApiConnection.v2.auth.login('username', 'root', 'test').subscribe(
            (response: ApiResponseData<LoginResponse>) => {
                this.resourceIri = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';
                this.loading = false;
            },
            (error: ApiResponseError) => {
                console.log('User failed to log in');
            }
        );
    }

    internalLinkClicked(linkVal: ReadLinkValue) {
        console.log(linkVal);
    }

}
