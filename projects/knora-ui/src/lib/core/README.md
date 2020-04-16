# Core module

This module is part of [DSP-UI](https://github.com/dasch-swiss/knora-ui-ng-lib) modules, developed by the team at the [Data and Service Center for Humanities DaSCH](http://dasch.swiss).

The core module contains tokens, constants and services in order to use DSP-API's RESTful webapi v2 and admin.

## Prerequisites

For help getting started with a new Angular app, check out the [Angular CLI](https://cli.angular.io/).

For existing apps, follow these steps to begin using the core functions.

## Install

This core module is included in the package @knora/ui.

### Required version of Knora: 12.0.0

## Setup

On version 6 of Angular CLI they removed the shim for global and other node built-ins as mentioned in [#9827 (comment)](https://github.com/angular/angular-cli/issues/9827#issuecomment-369578814). Because of the jsonld package, we have to manually shimming it inside of the **polyfills.ts** file of the app:

```typescript
// Add global to window, assigning the value of window itself.

 (window as any).global = window;
```

For the environment configuration (Knora API url etc. settings), we have to create the following configuration files and serverice:

```shell
mkdir src/config
touch src/config/config.dev.json
touch src/config/config.prod.json

ng g s app-init
```

The `config.dev.json` should look as follow:

```json
{
    "knora": {
        "apiProtocol": "http",
        "apiHost": "0.0.0.0",
        "apiPort": 3333,
        "apiPath": "",
        "jsonWebToken": "",
        "logErrors": true

    },
    "app": {
        "name": "Knora-APP",
        "url": "localhost:4200"
    }
}

```

The `config.prod.json` looks similar probably the knora.logErrors are set to false. The config files have to been integrated in `angular.json` in each "assets"-section:

```json
"assets": [
    "src/favicon.ico",
    "src/assets",
    "src/config"
]
```

It's possible to have different configuration files, depending on the environment definition in `src/environments/`. The name defined in environment is used to take the correct `config.xyz.json` file.

E.g. the environment.ts needs the name definition for develeop mode:

```typescript
export const environment = {
    name: 'dev',
    production: false
};
```

To load the correct configuration you have to write an `app-init.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { KuiConfig } from '@knora/core';
import { KnoraApiConnection, KnoraApiConfig } from '@knora/api';

@Injectable()
export class AppInitService {

    static knoraApiConnection: KnoraApiConnection;

    static knoraApiConfig: KnoraApiConfig;

    static kuiConfig: KuiConfig;

    constructor() { }

    Init() {

        return new Promise<void>((resolve, reject) => {

            // init knora-ui configuration
            AppInitService.kuiConfig = window['tempConfigStorage'] as KuiConfig;

            // init knora-api configuration
            AppInitService.knoraApiConfig = new KnoraApiConfig(
                AppInitService.kuiConfig.knora.apiProtocol,
                AppInitService.kuiConfig.knora.apiHost,
                AppInitService.kuiConfig.knora.apiPort
            );

            // set knora-api connection configuration
            AppInitService.knoraApiConnection = new KnoraApiConnection(AppInitService.knoraApiConfig);

            resolve();
        });
    }
}
```

This service will be loaded in `src/app/app.module.ts`:

```typescript
import { KnoraApiConnectionToken, KuiConfigToken, KuiCoreModule } from '@knora/core';
import { AppInitService } from './app-init.service';

export function initializeApp(appInitService: AppInitService) {
    return (): Promise<any> => {
        return appInitService.Init();
    };
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        KuiCoreModule
    ],
    providers: [
        AppInitService,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [AppInitService],
            multi: true
        },
        {
            provide: KuiConfigToken,
            useFactory: () => AppInitService.kuiConfig
        },
        {
            provide: KnoraApiConfigToken,
            useFactory: () => AppInitService.knoraApiConfig
        },
        {
            provide: KnoraApiConnectionToken,
            useFactory: () => AppInitService.knoraApiConnection
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

Additional you have to update the `src/main.ts` file:

```typescript
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import 'hammerjs';

if (environment.production) {
  enableProdMode();
}

function bootstrapFailed(result) {
    console.error('bootstrap-fail', result);
}

fetch(`config/config.${environment.name}.json`)
    .then(response => response.json())
    .then(config => {
        if (!config || !config['knora']) {
            bootstrapFailed(config);
            return;
        }

        // store the response somewhere that the AppInitService can read it.
        window['tempConfigStorage'] = config;

        platformBrowserDynamic()
            .bootstrapModule(AppModule)
            .catch(err => bootstrapFailed(err));
    })
    .catch(bootstrapFailed);
```

## Usage

The `@knora/core` is a configuration handler for `@knora/api` which has all the services to make Knora-api requests.

The following project-component example shows how to implement the two modules to get all projects form Knora.

```typescript
import { Component, Inject, OnInit } from '@angular/core';
import { ApiResponseData, ApiResponseError, KnoraApiConnection, ProjectsResponse, ReadProject } from '@knora/api';
import { KnoraApiConnectionToken } from '@knora/core';

@Component({
    selector: 'app-projects',
    template: `<ul><li *ngFor="let p of projects">{{p.longname}} (<strong>{{p.shortname}}</strong> | {{p.shortcode}})</li></ul>`
})
export class ProjectsComponent implements OnInit {
    projects: ReadProject[];

    constructor(
        @Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection
    ) { }

    ngOnInit() {
        this.getProjects();
    }

    getProjects() {
        this.knoraApiConnection.admin.projectsEndpoint.getProjects().subscribe(
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
