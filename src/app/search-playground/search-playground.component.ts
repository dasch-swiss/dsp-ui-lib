import { Component, OnChanges } from '@angular/core';
import { SearchParams } from '@dasch-swiss/dsp-ui/lib/viewer';

@Component({
    selector: 'app-search-playground',
    templateUrl: './search-playground.component.html',
    styleUrls: ['./search-playground.component.scss']
})
export class SearchPlaygroundComponent implements OnChanges {

    searchParams: SearchParams;

    constructor() { }

    ngOnChanges() {
        console.log(this.searchParams.query)
    }

    doSearch(search: SearchParams) {
        // reset search params
        this.searchParams = undefined;
        // we can do the routing here or send the search param
        // to (resource) list view directly
        console.log('do search:', search);
        this.searchParams = search;
        this.ngOnChanges();
    }

    openResource(id: string) {
        console.log('open ', id);
    }

}
