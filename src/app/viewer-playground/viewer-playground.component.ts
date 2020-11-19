import { Component, OnInit } from '@angular/core';
import { SessionService } from '@dasch-swiss/dsp-ui';
import { ReadLinkValue, ReadProject } from '@dasch-swiss/dsp-js';

@Component({
    selector: 'app-viewer-playground',
    templateUrl: './viewer-playground.component.html',
    styleUrls: ['./viewer-playground.component.scss']
})
export class ViewerPlaygroundComponent implements OnInit {

    // resorce from incunabula: book page
    resource = 'http://rdfh.ch/0803/18a671b8a601';

    constructor(
        private _sessionService: SessionService
    ) { }

    ngOnInit(): void {
        this._sessionService.isSessionValid().subscribe(status => console.log('session valid: ', status));
    }

    openProject(project: ReadProject) {
        // here you can redirect a user to the project page
        console.log('redircet to project page e.g. /project/:shortcode', project.shortcode);
    }

    refResourceClicked(linkValue: ReadLinkValue) {
        console.log('clicked: ', linkValue);
    }

    refResourceHovered(linkValue: ReadLinkValue) {
        console.log('hovered: ', linkValue);
    }
}
