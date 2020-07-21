import { Component, Inject, OnInit } from '@angular/core';
import {
    ApiResponseData, ApiResponseError, Constants,
    KnoraApiConnection,
    LogoutResponse, ReadGeomValue,
    ReadResource,
    ReadStillImageFileValue, ReadValue
} from '@dasch-swiss/dsp-js';
import { DspApiConnectionToken, Region, StillImageRepresentation } from '@dasch-swiss/dsp-ui';
import { mergeMap } from 'rxjs/operators';

// TODO: get test data from Knora resource
class Geom extends ReadValue {
    geometryString: string;
}

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

    actReg: string;

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

                const parseReg = new Geom();
                parseReg.geometryString = geomStr;

                const geometry = new ReadGeomValue(parseReg);

                const geomStr2
                    = '{"status":"active","lineColor":"#ff3333","lineWidth":2,"points":[{"x":0.1989010989010989,"y":0.18055555555555555},{"x":0.7252747252747253,"y":0.7245370370370371}],"type":"rectangle"}';

                const parseReg2 = new Geom();
                parseReg2.geometryString = geomStr2;

                const geometry2 = new ReadGeomValue(parseReg2);

                const regionRes = new ReadResource();
                regionRes.id = 'activeRegion';
                regionRes.label = 'test region ';
                regionRes.properties[Constants.HasGeometry] = [geometry];

                const regionRes2 = new ReadResource();
                regionRes2.id = 'activeRegion2';
                regionRes2.label = 'test region 2';
                regionRes2.properties[Constants.HasGeometry] = [geometry2];

                this.stillImageRepresentations
                    = [new StillImageRepresentation(res.getValuesAs('http://api.knora.org/ontology/knora-api/v2#hasStillImageFileValue', ReadStillImageFileValue)[0], [new Region(regionRes), new Region(regionRes2)])];

                this.loading = false;
            },
            err => {
                console.error(err);
            }
        );
    }

    regionClicked(regionIri: string) {
        console.log(regionIri);
    }
}
