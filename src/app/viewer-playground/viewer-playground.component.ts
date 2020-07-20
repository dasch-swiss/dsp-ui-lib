import { Component, OnInit } from '@angular/core';
import { ListViewParam } from '@dasch-swiss/dsp-ui';

@Component({
    selector: 'app-viewer-playground',
    templateUrl: './viewer-playground.component.html',
    styleUrls: ['./viewer-playground.component.scss']
})
export class ViewerPlaygroundComponent implements OnInit {

    listParams: ListViewParam = {
        query: 'kreuz',
        mode: 'fulltext'
    }

    constructor( ) { }

    ngOnInit(): void {

    }

    openResource(id: string) {
        console.log('Open Resource:', id);
    }

}
