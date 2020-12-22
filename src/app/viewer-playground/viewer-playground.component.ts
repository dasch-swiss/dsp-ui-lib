import { Component, OnInit } from '@angular/core';
import { SessionService } from '@dasch-swiss/dsp-ui';
import { ReadLinkValue, ReadProject } from '@dasch-swiss/dsp-js';

@Component({
    selector: 'app-viewer-playground',
    templateUrl: './viewer-playground.component.html',
    styleUrls: ['./viewer-playground.component.scss']
})
export class ViewerPlaygroundComponent implements OnInit {

    // resorce examples: book pages (incunabula), facsimile (beol), thing (antyhing), book (incunabula)
    resources = [
        'http://rdfh.ch/0803/18a671b8a601',
        'http://rdfh.ch/0803/7e4cfc5417',
        'http://rdfh.ch/0801/page_resource',
        'http://rdfh.ch/0001/a-thing-with-text-valuesLanguage',
        'http://rdfh.ch/0803/5e77e98d2603'
    ];
    resourceIri: string = this.resources[0];


    constructor(
        private _sessionService: SessionService
    ) { }

    ngOnInit(): void {
        this._sessionService.isSessionValid().subscribe(status => console.log('session valid: ', status));
    }

    refProjectClicked(project: ReadProject) {
        // here you can redirect a user to the project page
        console.log('project clicked: redircet to project page e.g. /project/:shortcode', project);
    }

    refProjectHovered(project: ReadProject) {
        console.log('project hovered: show preview', project);
    }

    refResourceClicked(linkValue: ReadLinkValue) {
        console.log('clicked: ', linkValue);
    }

    refResourceHovered(linkValue: ReadLinkValue) {
        console.log('hovered: ', linkValue);
    }
}
