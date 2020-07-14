import { Component, OnInit, Inject } from '@angular/core';
import { ReadResource, KnoraApiConnection, ReadResourceSequence, ApiResponseError } from '@dasch-swiss/dsp-js';
import { DspApiConnectionToken } from '@dasch-swiss/dsp-ui';

@Component({
    selector: 'app-viewer-playground',
    templateUrl: './viewer-playground.component.html',
    styleUrls: ['./viewer-playground.component.scss']
})
export class ViewerPlaygroundComponent implements OnInit {

    loading = true;

    // test data
    resources: ReadResourceSequence;

    constructor(
        @Inject(DspApiConnectionToken) private _dspApiConnection: KnoraApiConnection
    ) { }

    ngOnInit(): void {

        this._dspApiConnection.v2.res.getResources(["http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw", "http://rdfh.ch/0001/uqmMo72OQ2K2xe7mkIytlg"]).subscribe(
            (response: ReadResourceSequence) => {
                this.resources = response;
            },
            (error: ApiResponseError) => {
                console.error(error);
            }
        )
    }

}
