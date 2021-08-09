import { Component, OnInit } from '@angular/core';
import { SessionService,  ShortResInfo } from '@dasch-swiss/dsp-ui';
import { ReadLinkValue, ReadProject } from '@dasch-swiss/dsp-js';

@Component({
    selector: 'app-viewer-playground',
    templateUrl: './viewer-playground.component.html',
    styleUrls: ['./viewer-playground.component.scss']
})
export class ViewerPlaygroundComponent implements OnInit {

    // resorce from incunabula: book page
    resources = [
        'http://rdfh.ch/0803/18a671b8a601',
        'http://rdfh.ch/0803/7e4cfc5417',
        'http://rdfh.ch/0803/6ad3e2c47501',
        'http://rdfh.ch/0001/a-thing-with-text-valuesLanguage'
    ];
    resourceIri: string = this.resources[0];

    resourcesWithLabel: ShortResInfo[] = [
        {
            id: 'http://rdfh.ch/0803/18a671b8a601',
            label: 'e2V'
        },
        {
            id: 'http://rdfh.ch/0803/7e4cfc5417',
            label: 'g3r'
        },
        {
            id: 'http://rdfh.ch/0803/6ad3e2c47501',
            label: '30v'
        },
        {
            id: 'http://rdfh.ch/0803/009e225a5f01',
            label: 'm3v'
        },
        {
            id: 'http://rdfh.ch/0803/00ed33070f02',
            label: 'C5r'
        }
    ];


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
