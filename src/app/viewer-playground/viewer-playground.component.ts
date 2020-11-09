import { Component, OnInit } from '@angular/core';
import { SessionService } from '@dasch-swiss/dsp-ui';
import { ReadLinkValue, ReadProject } from '@dasch-swiss/dsp-js';
import { prototype } from 'events';

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

    openProject(project: ReadProject) {
        // here you can redirect a user to the project page
        console.log('redircet to project page e.g. /project/:shortname', project.shortname);
    }

    refResourceClicked(linkValue: ReadLinkValue) {
        console.log('clicked: ', linkValue);
    }

    refResourceHovered(linkValue: ReadLinkValue) {
        console.log('hovered: ', linkValue);
    }
}
