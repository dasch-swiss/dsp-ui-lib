import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


/**
 * @deprecated since v10.0.0
 *
 * Will be replaced by `@knora/api` (github:knora-api-js-lib)
 *
 * Represents the parameters of an extended search.
 */
export class ExtendedSearchParams {

    /**
     *
     * @param generateGravsearch a function that generates a Gravsearch query.
     *
     * The function takes the offset
     * as a parameter and returns a Gravsearch query string.
     * Returns false if not set correctly (init state).
     */
    constructor(public generateGravsearch: (offset: number) => string | boolean) {

    }

}

@Injectable({
    providedIn: 'root'
})
/**
 * @deprecated since v10.0.0
 *
 * Will be replaced by `@knora/api` (github:knora-api-js-lib)
 * Temporarily stores the parameters of an extended search.
 */
export class SearchParamsService {

    private _currentSearchParams;

    constructor() {
        // init with a dummy function that returns false
        // if the application is reloaded, this will be returned
        this._currentSearchParams = new BehaviorSubject<ExtendedSearchParams>(new ExtendedSearchParams((offset: number) => false));
    }

    /**
     * Updates the parameters of an extended search.
     *
     * @param searchParams search parameters
     * @returns void
     */
    changeSearchParamsMsg(searchParams: ExtendedSearchParams): void {
        this._currentSearchParams.next(searchParams);
    }

    /**
     * Gets the search params of an extended search.
     *
     * @returns ExtendedSearchParams - search parameters
     */
    getSearchParams(): ExtendedSearchParams {
        return this._currentSearchParams.getValue();
    }

}
