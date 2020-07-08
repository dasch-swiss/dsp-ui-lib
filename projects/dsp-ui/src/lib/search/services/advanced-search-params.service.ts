import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/*
 * Represents the parameters of an extended search.
 */
export class AdvancedSearchParams {

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
export class AdvancedSearchParamsService {

    private _currentSearchParams;

    constructor() {
        // init with a dummy function that returns false
        // if the application is reloaded, this will be returned
        this._currentSearchParams = new BehaviorSubject<AdvancedSearchParams>(new AdvancedSearchParams((offset: number) => false));
    }

    /**
     * Updates the parameters of an extended search.
     *
     * @param searchParams new extended search params.
     */
    changeSearchParamsMsg(searchParams: AdvancedSearchParams): void {
        this._currentSearchParams.next(searchParams);
    }

    /**
     * Gets the search params of an extended search.
     *
     */
    getSearchParams(): AdvancedSearchParams {
        return this._currentSearchParams.getValue();
    }

}
