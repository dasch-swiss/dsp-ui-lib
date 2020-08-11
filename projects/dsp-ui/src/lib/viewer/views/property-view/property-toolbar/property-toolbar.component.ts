import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { ReadProject, KnoraApiConnection, ApiResponseData, ProjectResponse, ApiResponseError } from '@dasch-swiss/dsp-js';
import { DspApiConnectionToken } from '../../../../core/core.module';

@Component({
  selector: 'dsp-property-toolbar',
  templateUrl: './property-toolbar.component.html',
  styleUrls: ['./property-toolbar.component.scss']
})
export class PropertyToolbarComponent implements OnInit {

    @Input() projectiri: string;
    @Input() ontologyiri: string;
    @Input() arkurl: string;

    @Input() showAllProps: boolean;

    @Output() toggleProps: EventEmitter<boolean> = new EventEmitter<boolean>();

    project: ReadProject;

    constructor(
        @Inject(DspApiConnectionToken) private _dspApiConnection: KnoraApiConnection,
    ) { }

    ngOnInit() {
        // get project information
        this._dspApiConnection.admin.projectsEndpoint.getProjectByIri(this.projectiri).subscribe(
            (response: ApiResponseData<ProjectResponse>) => {
                this.project = response.body.project;
            },
            (error: ApiResponseError) => {
                console.error(error);
            }
        )
    }

}
