import { Component, Inject, OnInit } from '@angular/core';
import { KnoraApiConnection } from '@dasch-swiss/dsp-js';
import { AdvancedSearchParamsService, DspApiConnectionToken, SearchParams } from '@dasch-swiss/dsp-ui';

@Component({
    selector: 'app-advanced-search-playground',
    templateUrl: './advanced-search-playground.component.html',
    styleUrls: ['./advanced-search-playground.component.scss']
})
export class AdvancedSearchPlaygroundComponent implements OnInit {

    loading: boolean;

    constructor(
        private _advancedSearchParamsService: AdvancedSearchParamsService,
        @Inject(DspApiConnectionToken) private _dspApiConnection: KnoraApiConnection) {
    }

    ngOnInit(): void {

    }

    submitQuery(gravsearch: SearchParams) {

        console.log('search params', this._advancedSearchParamsService.getSearchParams().generateGravsearch(0));
    }

}
