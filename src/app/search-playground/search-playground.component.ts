import { Component } from '@angular/core';

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

}
