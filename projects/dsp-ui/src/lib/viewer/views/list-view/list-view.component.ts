import { Component, EventEmitter, Inject, Input, OnChanges, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ApiResponseError, CountQueryResponse, IFulltextSearchParams, KnoraApiConnection, ReadResourceSequence } from '@dasch-swiss/dsp-js';
import { NotificationService } from '../../../action/services/notification.service';
import { DspApiConnectionToken } from '../../../core/core.module';
import { AdvancedSearchParamsService } from '../../../search/services/advanced-search-params.service';

/**
 * query: search query. It can be gravserch query or fulltext string query.
 * The query value is expected to have at least length of 3 characters.
 *
 * mode: search mode "fulltext" OR "gravsearch"
 *
 * filter: Optional fulltext search parameter with following (optional) properties:
 *   - limitToResourceClass: string; Iri of resource class the fulltext search is restricted to, if any.
 *   - limitToProject: string; Iri of the project the fulltext search is restricted to, if any.
 *   - limitToStandoffClass: string; Iri of standoff class the fulltext search is restricted to, if any.
 */
export interface SearchParams {
    query: string;
    mode: 'fulltext' | 'gravsearch';
    filter?: IFulltextSearchParams;
}

@Component({
    selector: 'dsp-list-view',
    templateUrl: './list-view.component.html',
    styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnChanges {

    @Input() search: SearchParams;

    @Input() view?: 'list' | 'grid' = 'list';    // TODO: will be expanded with 'table' as soon as resource-table component is done

    @Input() displayViewSwitch?: boolean = true;

    /**
     * Click on an item will emit the resource iri
     *
     * @param {EventEmitter<string>} resourceSelected
     */
    @Output() resourceSelected: EventEmitter<string> = new EventEmitter<string>();

    resources: ReadResourceSequence;

    selectedResourceIdx = 0;

    // MatPaginator Output
    pageEvent: PageEvent;

    // Number of all results
    numberOfAllResults: number;

    // progress status
    loading = true;

    constructor(
        @Inject(DspApiConnectionToken) private _dspApiConnection: KnoraApiConnection,
        private _notification: NotificationService,
        private _advancedSearchParamsService: AdvancedSearchParamsService,
    ) { }

    ngOnChanges(): void {
        // reset
        this.pageEvent = new PageEvent();
        this.pageEvent.pageIndex = 0;
        this.resources = undefined;

        this._doSearch();
    }

    /**
     *
     * @param view 'list' | ' grid'; TODO: will be expanded with 'table' as soon as resource-table component is done
     */
    toggleView(view: 'list' | 'grid') {
        this.view = view;
    }

    emitSelectedResource(id: string) {
        // get selected resource index from list to highlight it
        for (let idx = 0; idx < this.resources.resources.length; idx++) {
            if (this.resources.resources[idx].id === id) {
                this.selectedResourceIdx = idx;
                break;
            }
        }
        this.resourceSelected.emit(id);
    }

    goToPage(page: PageEvent) {
        this.pageEvent = page;
        this._doSearch();
    }

    private _doSearch() {

        this.loading = true;

        if (this.search.mode === 'fulltext') {
            // search mode: fulltext
            if (this.pageEvent.pageIndex === 0) {
                // perform count query
                this._dspApiConnection.v2.search.doFulltextSearchCountQuery(this.search.query, this.pageEvent.pageIndex, this.search.filter).subscribe(
                    (response: CountQueryResponse) => {
                        this.numberOfAllResults = response.numberOfResults;
                    },
                    (error: ApiResponseError) => {
                        this._notification.openSnackBar(error);
                    }
                );
            }

            // perform full text search
            this._dspApiConnection.v2.search.doFulltextSearch(this.search.query, this.pageEvent.pageIndex, this.search.filter).subscribe(
                (response: ReadResourceSequence) => {
                    this.resources = response;
                    this.loading = false;
                    this.emitSelectedResource(this.resources.resources[0].id);
                },
                (error: ApiResponseError) => {
                    this._notification.openSnackBar(error);
                    this.loading = false;
                }
            );

        } else if (this.search.mode === 'gravsearch') {


            // search mode: gravsearch
            if (this.pageEvent.pageIndex === 0) {
                // perform count query
                this._dspApiConnection.v2.search.doExtendedSearchCountQuery(this.search.query).subscribe(
                    (response: CountQueryResponse) => {
                        this.numberOfAllResults = response.numberOfResults;
                    },
                    (error: ApiResponseError) => {
                        this._notification.openSnackBar(error);
                    }
                );
            }

            // perform advanced search
            const gravsearch = this._advancedSearchParamsService.getSearchParams().generateGravsearch(this.pageEvent.pageIndex);

            if (typeof gravsearch === 'string') {
                this._dspApiConnection.v2.search.doExtendedSearch(gravsearch).subscribe(
                    (response: ReadResourceSequence) => {
                        this.resources = response;
                        this.loading = false;
                        this.emitSelectedResource(this.resources.resources[0].id);
                    },
                    (error: ApiResponseError) => {
                        this._notification.openSnackBar(error);
                        this.loading = false;
                    }
                );
            } else {
                console.error('The gravsearch query is not set correctly');
            }

        }

    }

}
