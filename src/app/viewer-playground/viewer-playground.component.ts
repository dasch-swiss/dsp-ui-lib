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
        this._dspApiConnection.v2.search.doFulltextSearch('kreuz').subscribe(
            (response: ReadResourceSequence) => {
                console.log(response);
                this.resources = response;
            },
            (error: ApiResponseError) => {
                console.error(error);
            }
        )
    }

    openResource(ev: Event) {
        console.log('Open Resource:', ev);
    }

}
