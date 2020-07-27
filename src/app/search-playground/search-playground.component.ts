import { Component } from '@angular/core';
import { SearchParams } from '@dasch-swiss/dsp-ui/lib/viewer';

@Component({
    selector: 'app-search-playground',
    templateUrl: './search-playground.component.html',
    styleUrls: ['./search-playground.component.scss']
})
export class SearchPlaygroundComponent {

    constructor() { }

    submitQuery(query: string) {
        console.log('output', query);
    }

    doSearch(search: SearchParams) {
        // we can do the routing here or send the search param
        // to (resource) list view directly
        console.log('do search:', search);
    }

}
