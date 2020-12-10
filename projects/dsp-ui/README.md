# DSP-UI-LIB &mdash; A library to easily create Knora/DSP Apps

[![npm version](https://badge.fury.io/js/%40dasch-swiss%2Fdsp-ui.svg)](https://www.npmjs.com/package/@dasch-swiss/dsp-ui)
[![CI](https://github.com/dasch-swiss/knora-ui-ng-lib/workflows/CI/badge.svg)](https://github.com/dasch-swiss/knora-ui-ng-lib/actions?query=workflow%3ACI)
[![npm downloads](https://img.shields.io/npm/dt/@dasch-swiss/dsp-ui.svg?style=flat)](https://www.npmjs.com/package/@dasch-swiss/dsp-ui)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@dasch-swiss/dsp-ui.svg?style=flat)](https://www.npmjs.com/package/@dasch-swiss/dsp-ui)
[![license](https://img.shields.io/npm/l/@dasch-swiss/dsp-ui.svg?style=flat)](https://github.com/dasch-swiss/dsp-ui-lib/blob/main/LICENSE)

## Introduction
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
The viewer module contains components to display resources of different types from DSP-API, 
and CRUD components to display, edit, create, and delete values.

### DspSearchModule
The search module allows the user to make fulltext and advanced searches in DSP-API,
using a graphical interface.

### DspActionModule
The action module contains special buttons (e.g. to sort a list), pipes and directives.

## Setup

### Installation
To use this library in your Angular app, install it from NPM:

```bash
npm install @dasch-swiss/dsp-ui
```

### Dependencies
This library has the following peer dependencies, which you also have to meet:

<!-- TODO: the following package will be renamed to @dasch-swiss/dsp-js and the list of dependencies incl. version will be added to an external matrix file -->
- [@dasch-swiss/dsp-js](https://www.npmjs.com/package/@dasch-swiss/dsp-js)
- [jdnconvertiblecalendar](https://www.npmjs.com/package/jdnconvertiblecalendar)
- [jdnconvertiblecalendardateadapter](https://www.npmjs.com/package/jdnconvertiblecalendardateadapter)
- [ngx-color-picker](https://www.npmjs.com/package/ngx-color-picker)
- [openseadragon](https://openseadragon.github.io/#download)
- [svg-overlay](https://github.com/openseadragon/svg-overlay)
- [@ckeditor/ckeditor5-angular](https://www.npmjs.com/package/@ckeditor/ckeditor5-angular)
- [ckeditor-build](http://github.com/dasch-swiss/ckeditor_custom_build)

### Supported DSP-API Version
Check [vars.mk](../../vars.mk) to see which version of DSP-API this library is compatible with.

### Setup
DSP-UI-LIB supports runtime configuration.
The configuration is loaded when your Angular application starts.

In your Angular project, create the file `config.dev.json` inside `src/config/`:

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

Likewise, create a file `config.prod.json` with `logErrors` set to `false`.
The configuration files are needed to establish a connection to DSP-API.

Create the property `name` in `src/environments/environment.ts` and set it to "dev":

```typescript
export const environment = {
  name: 'dev', // <-- this env. will load config.dev.json     
  production: false
};
```

In `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  name: 'prod', // <-- this env. will load config.prod.json
  production: true
};
```

Depending on the [build options](https://angular.io/guide/build#configuring-application-environments) (dev or prod),
the environment and configuration are chosen.

The config files have to be integrated in `angular.json` in the "assets" section:

```json
"assets": [
    "src/favicon.ico",
    "src/assets",
    "src/config"    <-- add the config directory here
]
```

Define the following three [factory providers](https://angular.io/guide/dependency-injection-providers#using-factory-providers) in your application's `app.module.ts`:

 1. Provide a function that calls `AppInitService`'s method `Init` and returns its return value which is a `Promise`.
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
      useFactory: (appInitService: AppInitService) => appInitService.dspApiConfig,
      deps: [AppInitService] // depends on AppInitService
    },
    // 3.
    {
      provide: DspApiConnectionToken,
      useFactory: (appInitService: AppInitService) => new KnoraApiConnection(appInitService.dspApiConfig),
      deps: [AppInitService] // depends on AppInitService
   }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

The contents of the configuration can be accessed via `AppInitService`s member `config`.
Just inject `AppInitService` in you service's or component's constructor.

The library needs a global styling in the app to override some material design rules.
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
Add the desired modules from DSP-UI to the `app.module.ts`.
Always import `DspCoreModule`.

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
**DspCoreModule** implements the `InjectionToken` `DspApiConnectionToken`.
The token provides an instance of `KnoraApiConnection` from [`@dasch-swiss/dsp-js`](https://www.npmjs.com/package/@dasch-swiss/dsp-js)
which offers methods to make requests to [DSP-API](https://docs.dasch.swiss/developers/knora/api-reference/queries/).
The following `ProjectsComponent` example shows how to retrieve all projects from DSP-API:

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

**DspViewerModule** contains components to display resources; as single item or as a list for search results.
It is comprised of resource sub-components such as file representations components to display still image, video, audio or text only
and also value components to use single property elements.

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

**DspSearchModule** allows different ways of searching in order to make simple or complex searches in DSP-API. This module contains various components you can use to search and all of them can either be used individually or in combination with one another using the search panel.

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
