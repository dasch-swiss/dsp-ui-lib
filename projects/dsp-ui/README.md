# DSP-UI-LIB &mdash; A library to easily create Knora/DSP Apps

[![npm version](https://badge.fury.io/js/%40dasch-swiss%2Fdsp-ui.svg)](https://www.npmjs.com/package/@dasch-swiss/dsp-ui)
[![CI](https://github.com/dasch-swiss/knora-ui-ng-lib/workflows/CI/badge.svg)](https://github.com/dasch-swiss/knora-ui-ng-lib/actions?query=workflow%3ACI)
[![npm downloads](https://img.shields.io/npm/dt/@dasch-swiss/dsp-ui.svg?style=flat)](https://www.npmjs.com/package/@dasch-swiss/dsp-ui)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@dasch-swiss/dsp-ui.svg?style=flat)](https://www.npmjs.com/package/@dasch-swiss/dsp-ui)
[![license](https://img.shields.io/npm/l/@dasch-swiss/dsp-ui.svg?style=flat)](https://github.com/dasch-swiss/dsp-ui-lib/blob/main/LICENSE)

The modules contained in DSP-UI-LIB help create an [Angular](https://angular.io) application to allow the user to connect to [DSP-API](https://docs.dasch.swiss/developers/knora/api-reference/)
in a quick and simple way.
Components and directives rely on [Angular Material](https://material.angular.io).

DSP-UI-LIB is [free software](http://www.gnu.org/philosophy/free-sw.en.html),
released under [GNU Affero General Public](http://www.gnu.org/licenses/agpl-3.0.en.html) license.

## Library modules

This library consists of four Angular modules that are briefly described below.
See [design documentation](design-documentation.md) for more detailed information.

### DspCoreModule

The core module contains configuration files and all injection tokens needed to connect to DSP-API.

### DspViewerModule

The viewer module contains components to show the resource class representations from DSP-API, the GUI-elements for the property values
and frameworks to display these values in different ways.

### DspSearchModule

The search module allows the user to make simple or extended searches in DSP-API.
In the extended search, resource class and its properties related to one specific ontology are selected to create your query.

### DspActionModule

The action module contains special buttons (e.g. to sort a list), pipes and directives.

## Installation

```bash
npm install @dasch-swiss/dsp-ui
```

### Dependencies

#### NPM Dependencies
This library has the following peer dependencies, which you also have to meet:

<!-- TODO: the following package will be renamed to @dasch-swiss/dsp-js and the list of dependencies incl. version will be added to an external matrix file -->
- [@dasch-swiss/dsp-js](https://www.npmjs.com/package/@dasch-swiss/dsp-js)
- [jdnconvertiblecalendar](https://www.npmjs.com/package/jdnconvertiblecalendar)
- [jdnconvertiblecalendardateadapter](https://www.npmjs.com/package/jdnconvertiblecalendardateadapter)
- [ngx-color-picker](https://www.npmjs.com/package/ngx-color-picker)
- [openseadragon](https://openseadragon.github.io/#download)
- [svg-overlay](https://github.com/openseadragon/svg-overlay)
- [@ckeditor/ckeditor5-angular](https://www.npmjs.com/package/@ckeditor/ckeditor5-angular)
- [ckeditor-build](github:dasch-swiss/ckeditor_custom_build)

#### Supported DSP-API Version
Check [vars.mk](../../vars.mk) to see which version of DSP-API this library is compatible with.

## Setup

The module supports runtime config to load the API configuration on load as opposed to on build. This helps run an App as a docker image in various environments. However, this requires some modifications in your app. We suggest building the app with [@angular/cli](https://cli.angular.io/).

First, let's make a `config.dev.json` file in an additional folder `src/config/`:

```json
{
  "apiProtocol": "http",
  "apiHost": "0.0.0.0",
  "apiPort": 3333,
  "apiPath": "",
  "jsonWebToken": "",
  "logErrors": true
}
```

It's possible to create several config files e.g. one for productive use. In this case, `logErrors` should be set to `false` and the filename would be `config.prod.json`. In the environment files, we have to add the corresponding name:

```typescript
export const environment = {
  name: 'dev',      // <-- add the name 'dev', 'prod', etc. here.
  production: false
};
```

The config files have to be integrated in `angular.json` in all "assets"-sections:

```json
"assets": [
    "src/favicon.ico",
    "src/assets",
    "src/config"    <-- add this line and do not forget the comma on the previous line
]
```

Define the following three factory methods in `app.module.ts`:

 1. Return a function that calls `AppInitService`'s method `Init` and return its return value which is a `Promise`.
   Angular waits for this `Promise` to be resolved.
   The `Promise` will be resolved once the configuration file has been fetched and its contents have been assigned.
 1. Get the config from the `AppInitService` instance and provide it as `DspApiConfigToken`.
 1. Create an KnoraApiConnection instance with the config and provide it as `DspApiConnectionToken`.  

Provide it in the main module and include the desired DSP-UI modules in the imports:

```typescript
@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DspCoreModule,      // <-- add the dsp-ui modules here
    DspViewerModule
  ],
  providers: [
     // 1.
    {
      provide: APP_INITIALIZER, // see https://angular.io/api/core/APP_INITIALIZER
      useFactory: (appInitService: AppInitService) =>
                      (): Promise<any> => {
                          return appInitService.Init('config', environment);
                      },
      deps: [AppInitService], // depends on AppInitService
      multi: true
    },
    // 2.
    {
      provide: DspApiConfigToken,
      useFactory: (appInitService: AppInitService) => appInitService.dspApiConfig, // AppInitService is passed to the factory method
      deps: [AppInitService] // depends on AppInitService
    },
    // 3.
    {
      provide: DspApiConnectionToken,
      useFactory: (appInitService: AppInitService) => new KnoraApiConnection(appInitService.dspApiConfig), // AppInitService is passed to the factory method
      deps: [AppInitService] // depends on AppInitService
   }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Do not forget to import `APP_INITIALIZER` from `@angular/core` and the desired DSP-UI modules from `@dasch-swiss/dsp-ui`.

The contents of the configuration can be accessed via `AppInitService`s member `config`.
Just include `AppInitService` in you service's or component's constructor.

The module needs a global styling in the app to override some material design rules.
If you're using Angular CLI, this is as simple as including one line in your `styles.scss` file:

```css
@import '@dasch-swiss/dsp-ui/src/assets/style/dsp-ui.scss';
```

Alternatively, you can just reference the file directly. This would look something like:

```html
<link href="node_modules/@dasch-swiss/dsp-ui/assets/style/dsp-ui.scss" rel="stylesheet">
```

## Usage
<!-- TODO: add the modules to app.modules and use them as usual  -->
<!-- app.modules -->
Add the desired modules from DSP-UI to the `app.module.ts`. `DspCoreModule` must be imported at the very minimum!

```typescript
@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DspCoreModule        // <-- add the dsp-ui core module here
  ],
  providers: [ ... ]    // <-- add providers as mentioned in section above
  bootstrap: [AppComponent]
})
export class AppModule { }
```

<!-- example of component e.g. get all projects and display as a list -->
The **DspCoreModule** is a configuration handler for [`@dasch-swiss/dsp-js`](https://www.npmjs.com/package/@dasch-swiss/dsp-js) which offers all the services to make [DSP-API requests](https://docs.dasch.swiss/developers/knora/api-reference/queries/). The following ProjectsComponent example shows how to implement the two libraries to get all projects form DSP-API:

```typescript
import { Component, Inject, OnInit } from '@angular/core';
import { DspApiConnectionToken } from '@dasch-swiss/dsp-ui';
import { ApiResponseData, ApiResponseError, KnoraApiConnection, ProjectsResponse, ReadProject } from '@dasch-swiss/dsp-js';

@Component({
  selector: 'app-projects',
  template: `<ul><li *ngFor="let p of projects">{{p.longname}} (<strong>{{p.shortname}}</strong> | {{p.shortcode}})</li></ul>`
})
export class ProjectsComponent implements OnInit {
  projects: ReadProject[];

  constructor(
    @Inject(DspApiConnectionToken) private _dspApiConnection: KnoraApiConnection
  ) { }

  ngOnInit() {
    this.getProjects();
  }

  getProjects() {
    this._dspApiConnection.admin.projectsEndpoint.getProjects().subscribe(
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

The **DspViewerModule** contains components to display resources; as single item or as a list for search results. It is comprised of resource sub-components such as file representations components to display still image, video, audio or text only and also value components to use single property elements.

Import DspViewerModule in the `app.module.ts`:

```typescript
@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DspCoreModule,
    DspViewerModule      // <-- add the dsp-ui viewer module here
  ],
  providers: [ ... ]    // <-- add providers as mentioned in section above
  bootstrap: [AppComponent]
})
export class AppModule { }
```
<!-- example of resource viewer -->

And use it in the component template as follows. The example shows how to display a resource by iri = 'http://rdfh.ch/0803/18a671b8a601'.

```html
<dsp-resource-view [iri]="'http://rdfh.ch/0803/18a671b8a601'"></dsp-resource-view>
```

The **DspSearchModule** allows different ways of searching in order to make simple or complex searches in DSP-API. This module contains various components you can use to search and all of them can either be used individually or in combination with one another using the search panel.

Import DspSearchModule in the `app.module.ts`:

```typescript
@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DspCoreModule,
    DspSearchModule     // <-- add the dsp-ui search module here
  ],
  providers: [ ... ]    // <-- add providers as mentioned in section above
  bootstrap: [AppComponent]
})
export class AppModule { }
```
<!-- example of search panel -->

And use it in the component template as follows.
The example shows how to display the search panel that includes the full text search bar. It can be customized by setting the parameters with your configuration.

```html
<dsp-search-panel
    [route]="'/search'"
    [projectfilter]="true"
    [expert]="false"
    [advanced]="false">
</dsp-search-panel>
```

<!-- TODO: link to main documentation or playground: e.g. https://docs.dasch.swiss/developers/knora-ui/documentation/ -->

## Contribution
See our [contribution guidelines](Contribution.md).
