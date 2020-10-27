import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApiResponseData, ApiResponseError, KnoraApiConnection, ProjectsResponse, ReadProject } from '@dasch-swiss/dsp-js';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DspApiConnectionToken } from '../../../core';
import { SortingService } from '../../services/sorting.service';

@Component({
    selector: 'dsp-select-project',
    templateUrl: './select-project.component.html',
    styleUrls: ['./select-project.component.scss']
})
export class SelectProjectComponent implements OnInit {

    // list of projects
    projects: ReadProject[];

    // selected project
    selectedProject: ReadProject;

    // filter projects while typing (autocomplete)
    filteredProjects: Observable<ReadProject[]>;

    // form group
    selectProjectForm: FormGroup;

    // in case of an (api) error
    error: any;

    // user IRI so we could show only projects that belongs to this user
    @Input() userIri?: string;

    @Output() projectInfo: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        @Inject(DspApiConnectionToken) private _dspApiConnection: KnoraApiConnection,
        private _sortingService: SortingService,
        private _formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {

        // clean autocomplete list
        this.projects = [];

        // get list of all projects
        this.getAllProjects();

        this.selectProjectForm = this._formBuilder.group({
            projectName: new FormControl({
                value: '', disabled: false
            })
        });

        this.filteredProjects = this.selectProjectForm.controls.projectName.valueChanges
            .pipe(
                startWith(''),
                map(project => project ? this.filter(this.projects, project) : [])
            );
    }

    /**
     * Get all public projects from DSP-API
     */
    getAllProjects(): void {
        if (this.userIri) {
            this._dspApiConnection.admin.usersEndpoint.getUserProjectMemberships(this.userIri).subscribe(
                (response: ApiResponseData<ProjectsResponse>) => {
                    this.projects = this._sortingService.keySortByAlphabetical(response.body.projects, 'shortname');
                },
                (error: ApiResponseError) => {
                    console.error(error);
                    this.error = error;
                }
            );
        } else {
            this._dspApiConnection.admin.projectsEndpoint.getProjects().subscribe(
                (response: ApiResponseData<ProjectsResponse>) => {
                    this.projects = this._sortingService.keySortByAlphabetical(response.body.projects, 'shortname');
                },
                (error: ApiResponseError) => {
                    console.error(error);
                    this.error = error;
                }
            );
        }
    }

    resetInput(ev: Event) {
        ev.preventDefault();
        this.selectProjectForm.controls.projectName.reset('');
    }

    /**
     * filter a list while typing in auto complete input field
     * @param list List of options
     * @param name Value to filter by
     * @returns Filtered list of options
     */
    filter(list: ReadProject[], name: string) {
        return list.filter(project => {
                return (project.shortname.toLowerCase().includes(name.toLowerCase()) ||
                    project.longname.toLowerCase().includes(name.toLowerCase()) ||
                    project.shortcode.toLowerCase().includes(name.toLowerCase()));
            }
        );
    }

    /**
     * get information for selected project
     *
     * @param val project shortname
     */
    getProject(val: string) {
        // TODO: return readProject object
        this.projectInfo.emit(val);
    }


}
