import { Component, OnInit } from '@angular/core';
import { SearchParams } from '@dasch-swiss/dsp-ui';

@Component({
    selector: 'app-viewer-playground',
    templateUrl: './viewer-playground.component.html',
    styleUrls: ['./viewer-playground.component.scss']
})
export class ViewerPlaygroundComponent implements OnInit {

    // two different search examples to use in ListView @Input:
    // fulltext search
    fulltextSearch: SearchParams = {
        query: 'mann',
        mode: 'fulltext',
        filter: {
            limitToProject: 'http://rdfh.ch/projects/0803'
        }
    }

    // gravsearch
    gravSearchExample = `PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
    PREFIX incunabula: <http://0.0.0.0:3333/ontology/0803/incunabula/simple/v2#>

    CONSTRUCT {
        ?book knora-api:isMainResource true .
        ?book incunabula:title ?title .

    } WHERE {
        ?book a incunabula:book .
        ?book incunabula:title ?title .
    }`;
    gravSearch: SearchParams = {
        query: JSON.stringify(this.gravSearchExample),
        mode: 'gravsearch'
    }

    constructor( ) { }

    ngOnInit(): void {

    }

    // open resource on click event
    openResource(id: string) {
        console.log('Open Resource:', id);
    }

}
