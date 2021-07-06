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

/* return the selected resources in below format
 *
 * count: total number of resources selected
 * selectedIds: list of selected resource's ids
 */
export interface FilteredResouces {
    count: number,
    resListIndex: number[],
    resIds: string[],
    selectionType: "multiple" | "single"
}

/* return the checkbox value
 *
 * checked: checkbox value
 * resIndex: resource index from the list
 */
export interface checkboxUpdate {
    checked: boolean,
    resListIndex: number,
    resId: string,
    isCheckbox: boolean
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
      * Set to true if multiple resources can be selected for comparison
      */
    @Input() withMultipleSelection?: boolean = false;

    /**
     * Click on checkbox will emit the resource info
     *
     * @param {EventEmitter<FilteredResouces>} resourcesSelected
     */
    @Output() multipleResourcesSelected?: EventEmitter<FilteredResouces> = new EventEmitter<FilteredResouces>();

    /**
     * @deprecated
     * Click on an item will emit the resource iri
     */
    @Output() resourceSelected: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Click on an item will emit the resource iri
     *
     * @param {EventEmitter<string>} singleResourceSelected
     */
    @Output() singleResourceSelected?: EventEmitter<string> = new EventEmitter<string>();

    resources: ReadResourceSequence;

    selectedResourceIdx: number[] = [];

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

    // If 'withMultipleSelection' is true, multiple resources are selected for comparision
    // If 'withMultipleSelection' is false, single resource is selected for viewing
    emitSelectedResources(resInfo: FilteredResouces) {
        this.selectedResourceIdx = resInfo.resListIndex;

        if (resInfo.selectionType === "multiple") {
            this.multipleResourcesSelected.emit(resInfo);
        } else {
            this.singleResourceSelected.emit(resInfo.resIds[0]);
        }
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
                    if (!this.withMultipleSelection) {
                        this.emitSelectedResources({count: 1, resListIndex: [0], resIds: [this.resources.resources[0].id], selectionType: "single"});
                    }
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
                        if (!this.withMultipleSelection) {
                            this.emitSelectedResources({count: 1, resListIndex: [0], resIds: [this.resources.resources[0].id], selectionType: "single"});
                        }
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
