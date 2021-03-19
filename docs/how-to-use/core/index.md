# DSP-UI CORE module

DspCoreModule is a configuration handler for [`@dasch-swiss/dsp-js`](https://www.npmjs.com/package/@dasch-swiss/dsp-js) which offers all the services to make [DSP-API requests](https://docs.dasch.swiss/developers/knora/api-reference/queries/).

## Prerequisites

For help getting started with a new Angular app, check out the [Angular CLI](https://cli.angular.io/).

For existing apps, follow these steps to begin using DSP-UI CORE.

## Installation

DspCoreModule is part of @dasch-swiss/dsp-ui, follow [the installation guide](/how-to-use/getting-started/).

## Usage

 The following ProjectsComponent example shows how to implement the two libraries to get all projects from DSP-API:

```typescript
import { Component, Inject, OnInit } from '@angular/core';
import { DspApiConnectionToken } from '@dasch-swiss/dsp-ui';
import { 
    ApiResponseData,
    ApiResponseError,
    KnoraApiConnection,
    ProjectsResponse,
    ReadProject
} from '@dasch-swiss/dsp-js';

@Component({
  selector: 'app-projects',
  template: `<ul><li *ngFor="let p of projects">{{p.longname}} (<strong>{{p.shortname}}</strong> | {{p.shortcode}})</li></ul>`
})
export class ProjectsComponent implements OnInit {
  projects: ReadProject[];

  constructor(
    @Inject(DspApiConnectionToken) private dspApiConnection: KnoraApiConnection
  ) { }

  ngOnInit() {
    this.getProjects();
  }

  getProjects() {
    this.dspApiConnection.admin.projectsEndpoint.getProjects().subscribe(
      (response: ApiResponseData<ProjectsResponse>) => {
        this.projects = response.body.projects;
      },
      (error: ApiResponseError) => {
        console.error(error);
      }
    );
  }
}
```
