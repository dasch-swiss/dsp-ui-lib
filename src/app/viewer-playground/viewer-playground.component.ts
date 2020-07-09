import { Component, Inject, OnInit } from '@angular/core';
import { ApiResponseError, KnoraApiConnection, ReadResourceSequence } from '@dasch-swiss/dsp-js';
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
        this._dspApiConnection.v2.search.doFulltextSearch('kreuz').subscribe(
            (response: ReadResourceSequence) => {
                this.resources = response;
            },
            (error: ApiResponseError) => {
                console.error(error);
            }
        )
    }

    openResource(ev: string) {
        console.log('Open Resource:', ev);
    }

}
