import { Component } from '@angular/core';

@Component({
    selector: 'app-search-playground',
    templateUrl: './search-playground.component.html',
    styleUrls: ['./search-playground.component.scss']
})
export class SearchPlaygroundComponent {

    loading: boolean = true;

    gravsearchQuery: string;

    constructor() { }

    setGravsearch(query: string) {

        this.loading = true;

        /* this._cache.del('gravsearch');

        this._cache.set('gravsearch', query);

        this._cache.get('gravsearch').subscribe(
            (response: string) => {
                // get cached query
                this.gravsearchQuery = response;
            },
            (error: any) => {
                console.error(error);
            }
        ); */

        this.loading = false;

    }

}
