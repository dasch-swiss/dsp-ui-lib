import { Component, Inject, OnInit } from '@angular/core';
import {
    ApiResponseData, ApiResponseError,
    KnoraApiConnection,
    LogoutResponse,
    ReadResource,
    ReadStillImageFileValue
} from '@dasch-swiss/dsp-js';
import { DspApiConnectionToken } from '@dasch-swiss/dsp-ui';
import { mergeMap } from 'rxjs/operators';

@Component({
    selector: 'app-still-image',
    templateUrl: './still-image-playground.component.html',
    styleUrls: ['./still-image-playground.component.scss']
})
export class StillImagePlaygroundComponent implements OnInit {

    resourceIri = 'http://rdfh.ch/0803/00014b43f902'; // incunabula
    loading: boolean;

    stillImageFileValues: ReadStillImageFileValue[];
    caption = 'test image';

    constructor(@Inject(DspApiConnectionToken) private knoraApiConnection: KnoraApiConnection) {
    }

    ngOnInit(): void {
        this.loading = true;

        this.knoraApiConnection.v2.auth.logout().pipe(
            mergeMap(
                (logoutRes: ApiResponseData<LogoutResponse> | ApiResponseError) => {
                    if (logoutRes instanceof ApiResponseData) {
                        return this.knoraApiConnection.v2.res.getResource(this.resourceIri);
                    } else {
                        throw logoutRes;
                    }
                })).subscribe(
            (res: ReadResource) => {
                this.stillImageFileValues =
                    res.getValuesAs('http://api.knora.org/ontology/knora-api/v2#hasStillImageFileValue', ReadStillImageFileValue);
                this.loading = false;
            },
            err => {
                console.error(err);
            }
        );
    }
}
