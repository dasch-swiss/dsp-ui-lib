import { Component, OnInit } from '@angular/core';
import { SearchParams, SessionService } from '@dasch-swiss/dsp-ui';

@Component({
    selector: 'app-viewer-playground',
    templateUrl: './viewer-playground.component.html',
    styleUrls: ['./viewer-playground.component.scss']
})
export class ViewerPlaygroundComponent implements OnInit {

    resource = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';

    constructor(
        private _sessionService: SessionService
     ) { }

    ngOnInit(): void {
        this._sessionService.isSessionValid().subscribe(status => console.log('session valid: ', status));
    }

}
