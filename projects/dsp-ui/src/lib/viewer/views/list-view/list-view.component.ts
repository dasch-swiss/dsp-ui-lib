import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { ReadResourceSequence, KnoraApiConnection, CountQueryResponse, ApiResponseError } from '@dasch-swiss/dsp-js';
import { PageEvent } from '@angular/material/paginator';
import { DspApiConnectionToken } from '../../../core';
import { IFulltextSearchParams } from '@dasch-swiss/dsp-js/src/api/v2/search/search-endpoint-v2';

/**
 * query: search query. It can be gravserch query or fulltext string query.
 * The query value is expected to have at least length of 3 characters.
 *
 * mode: search mode "fulltext" OR "gravsearch"
 *
 * params: Optional parameter with following optional properties:
 *   - limitToResourceClass: string; Iri of resource class the fulltext search is restricted to, if any.
 *   - limitToProject: string; Iri of the project the fulltext search is restricted to, if any.
 *   - limitToStandoffClass: string; Iri of standoff class the fulltext search is restricted to, if any.
 */
export interface ListViewParam {
    query: string;
    mode: 'fulltext' | 'gravsearch';
    params?: IFulltextSearchParams;
}

@Component({
    selector: 'dsp-list-view',
    templateUrl: './list-view.component.html',
    styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit {

    @Input() search: ListViewParam;
    // OR (?)
    @Input() resources: ReadResourceSequence;

    @Input() view?: 'list' | 'grid' = 'list';    // TODO: will be expanded with 'table' as soon as resource-table component is done

    /**
     * Click on an item will emit the resource iri
     *
     * @param {EventEmitter<string>} resourceSelected
     */
    @Output() resourceSelected: EventEmitter<string> = new EventEmitter<string>();

    // MatPaginator Output
    pageEvent: PageEvent;

    // Number of all results
    numberOfAllResults: number;

    // in case of an api request error
    errorMessage: ApiResponseError;

    // progress status
    loading = true;

    constructor(
        @Inject(DspApiConnectionToken) private _dspApiConnection: KnoraApiConnection
    ) { }

    ngOnInit(): void {
        this.pageEvent = new PageEvent();
        this.pageEvent.pageIndex = 0;
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
        this.resourceSelected.emit(id);
    }

    loadMoreResults(page: PageEvent) {
        this.pageEvent = page;
        // if (this.searchMode === 'extended') {
        //     this.generateGravsearchQuery();
        // }
        this._doSearch();
    }

    private _doSearch() {

        if (this.search.mode === 'fulltext') {
            // search mode: fulltext
            if (this.pageEvent.pageIndex === 0) {
                // perform count query
                this._dspApiConnection.v2.search.doFulltextSearchCountQuery(this.search.query, this.pageEvent.pageIndex, this.search.params).subscribe(
                    (response: CountQueryResponse) => {
                        this.numberOfAllResults = response.numberOfResults;
                    },
                    (error: ApiResponseError) => {
                        this.errorMessage = error;
                        console.error(error);
                    }
                );
            }

            // perform full text search
            this._dspApiConnection.v2.search.doFulltextSearch(this.search.query, this.pageEvent.pageIndex, this.search.params).subscribe(
                (response: ReadResourceSequence) => {
                    this.resources = response;
                    this.loading = false;
                },
                (error: ApiResponseError) => {
                    this.errorMessage = error;
                    console.error(error);
                    this.loading = false;
                }
            );

        } else {
            // search mode: gravsearch

        }

    }

}
