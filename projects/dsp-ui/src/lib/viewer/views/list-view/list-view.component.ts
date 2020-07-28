import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ApiResponseError, CountQueryResponse, KnoraApiConnection, ReadResourceSequence } from '@dasch-swiss/dsp-js';
import { DspApiConnectionToken } from '../../../core';

export interface FulltextSearchParams {
    /**
     * Iri of resource class the fulltext search is restricted to, if any.
     */
    limitToResourceClass?: string;
    /**
     * Iri of the project the fulltext search is restricted to, if any.
     */
    limitToProject?: string;
    /**
     * Iri of standoff class the fulltext search is restricted to, if any.
     */
    limitToStandoffClass?: string;
}

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
    filter?: FulltextSearchParams;
}

@Component({
    selector: 'dsp-list-view',
    templateUrl: './list-view.component.html',
    styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit {

    @Input() search: SearchParams;

    @Input() view?: 'list' | 'grid' = 'list';    // TODO: will be expanded with 'table' as soon as resource-table component is done

    /**
     * Click on an item will emit the resource iri
     *
     * @param {EventEmitter<string>} resourceSelected
     */
    @Output() resourceSelected: EventEmitter<string> = new EventEmitter<string>();

    resources: ReadResourceSequence;

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

    nextPage(page: PageEvent) {
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
                        this.errorMessage = error;
                        console.error(error);
                    }
                );
            }

            // perform full text search
            this._dspApiConnection.v2.search.doFulltextSearch(this.search.query, this.pageEvent.pageIndex, this.search.filter).subscribe(
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
            if (this.pageEvent.pageIndex === 0) {
                // perform count query
                this._dspApiConnection.v2.search.doExtendedSearchCountQuery(this.search.query).subscribe(
                    (response: CountQueryResponse) => {
                        this.numberOfAllResults = response.numberOfResults;
                    },
                    (error: ApiResponseError) => {
                        this.errorMessage = error;
                        console.error(error);
                    }
                );
            }

            // perform extended search
            this._dspApiConnection.v2.search.doExtendedSearch(this.search.query).subscribe(
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

        }

    }

}
