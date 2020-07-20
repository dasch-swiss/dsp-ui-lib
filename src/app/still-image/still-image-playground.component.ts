import { Component, Inject, OnInit } from '@angular/core';
import {
    ApiResponseData, ApiResponseError, Constants,
    KnoraApiConnection,
    LogoutResponse, ReadGeomValue,
    ReadResource,
    ReadStillImageFileValue
} from '@dasch-swiss/dsp-js';
import { DspApiConnectionToken, Region, StillImageRepresentation } from '@dasch-swiss/dsp-ui';
import { mergeMap } from 'rxjs/operators';
import { ParseReadGeomValue } from '../../../.yalc/@dasch-swiss/dsp-js/src/models/v2/resources/values/read/read-geom-value';

@Component({
    selector: 'app-still-image',
    templateUrl: './still-image-playground.component.html',
    styleUrls: ['./still-image-playground.component.scss']
})
export class StillImagePlaygroundComponent implements OnInit {

    resourceIri = 'http://rdfh.ch/0803/00014b43f902'; // incunabula
    loading: boolean;

    stillImageRepresentations: StillImageRepresentation[];
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

                // TODO: remove dummy region
                const geomStr
                    = '{"status":"active","lineColor":"#ff3333","lineWidth":2,"points":[{"x":0.0989010989010989,"y":0.18055555555555555},{"x":0.7252747252747253,"y":0.7245370370370371}],"type":"rectangle"}';

                const parseReg = new ParseReadGeomValue();
                parseReg.geometryString = geomStr;

                const geometry = new ReadGeomValue(parseReg);

                const regionRes = new ReadResource();
                regionRes.properties[Constants.HasGeometry] = [geometry];

                this.stillImageRepresentations
                    = [new StillImageRepresentation(res.getValuesAs('http://api.knora.org/ontology/knora-api/v2#hasStillImageFileValue', ReadStillImageFileValue)[0], [new Region(regionRes)])];





                this.loading = false;
            },
            err => {
                console.error(err);
            }
        );
    }
}
