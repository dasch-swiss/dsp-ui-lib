import { Component, OnInit } from '@angular/core';
import { ReadProject } from '@dasch-swiss/dsp-js';
import { SessionService } from '@dasch-swiss/dsp-ui';

@Component({
    selector: 'app-viewer-playground',
    templateUrl: './viewer-playground.component.html',
    styleUrls: ['./viewer-playground.component.scss']
})
export class ViewerPlaygroundComponent implements OnInit {

    // resource = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';
    resource = 'http://rdfh.ch/0803/18a671b8a601';

    constructor(
        private _sessionService: SessionService
    ) { }

    ngOnInit(): void {
        this._sessionService.isSessionValid().subscribe(status => console.log('session valid: ', status));
    }

    openProject(project: ReadProject) {
        // here you can redirect a user to the project page
        console.log('redircet to project page e.g. /project/:shortname', project.shortname);
    }
}
