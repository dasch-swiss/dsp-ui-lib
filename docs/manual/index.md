# DSP-UI library

## User Interface library for DSP-API

DSP-UI library is published on [npmJS](https://www.npmjs.com/package/@dasch-swiss/dsp-ui). DSP-UI contains 4 modules: core, viewer, search and action.

The modules help create a GUI to allow the user to use [DSP-API](https://docs.dasch.swiss/developers/knora/api-reference/) in a quick and simple way from within a web application. The modules are written in Typescript for use with [Angular](https://angular.io) (version 9). We decided to style components and directives with [Angular Material design](https://material.angular.io).

DSP-UI-LIB implements [DSP-JS-LIB](https://www.npmjs.com/package/@knora/api) to connect with [DSP-API](https://docs.dasch.swiss/developers/knora/api-reference/). DSP-API is a software framework for storing, sharing, and working with primary sources and data in the humanities.

**DSP-UI requires [DSP-API version ^12.0.0](https://github.com/dasch-swiss/knora-api/releases/tag/v12.0.0)**

## Library modules

### [DspActionModule](/developers/dsp-ui/documentation/action/index-action)
*Special pipes and buttons*
> DspActionModule contains special pipes to sort lists or to get the index key in arrays, but also directives and components for images, sort buttons and s.o.

### [DspCoreModule](/developers/dsp-ui/documentation/core/index-core)
*Services for API requests*
> DspCoreModule is a configuration handler for [`@knora/api`](https://www.npmjs.com/package/@knora/api) which offers all the services to make [DSP-API requests](https://docs.dasch.swiss/developers/knora/api-reference/queries/).

### [DspSearchModule](/developers/dsp-ui/documentation/search/index-search)
*Full search panel*
> DspSearchModule allows to make full text or extended searches in DSP-API. Filter by resource class and its properties related to an ontology.

### [DspViewerModule](/developers/dsp-ui/documentation/viewer/index-viewer)
*Resources, Properties, Lists, Value components*
> DspViewerModule contains object components to show a resource class representation, the property gui-elements and various view frameworks.

* * *

## Installation

```bash
npm install @dasch-swiss/dsp-ui
```

### Dependencies

The module has the following package dependencies, which you also have to install.

<!-- TODO: the following package will be renamed to @dasch-swiss/dsp-js and the list of dependencies incl. version will be added to an external matrix file -->
- [@knora/api](https://www.npmjs.com/package/@knora/api)
- [jdnconvertiblecalendar@0.0.5](https://www.npmjs.com/package/jdnconvertiblecalendar)
- [jdnconvertiblecalendardateadapter@0.0.13](https://www.npmjs.com/package/jdnconvertiblecalendardateadapter)
- [ngx-color-picker@9.1.0](https://www.npmjs.com/package/ngx-color-picker)

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

Then we can make a service that will fetch the configs:

```shell
ng generate service app-init
```

```typescript
import { Injectable } from '@angular/core';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  static dspApiConnection: KnoraApiConnection;

  static dspApiConfig: KnoraApiConfig;

  constructor() { }

  Init() {

    return new Promise<void>((resolve) => {

      // get api config information from temp storage
      const dspApiConfig: KnoraApiConfig = window['tempConfigStorage'] as KnoraApiConfig;

      // init dsp-api configuration
      AppInitService.dspApiConfig = new KnoraApiConfig(
        dspApiConfig.apiProtocol,
        dspApiConfig.apiHost,
        dspApiConfig.apiPort,
        dspApiConfig.apiPath,
        dspApiConfig.jsonWebToken,
        dspApiConfig.logErrors
      );

      // set knora-api connection configuration
      AppInitService.dspApiConnection = new KnoraApiConnection(AppInitService.dspApiConfig);

      resolve();
    });
  }
}
```

Once we have this service, we have to edit the `app.module.ts` with a function to load the config:

```typescript
export function initializeApp(appInitService: AppInitService) {
  return (): Promise<any> => {
    return appInitService.Init();
  };
}
```

Provide it in the main module and include the desired DSP-UI modules in the imports:

```typescript
import { DspApiConfigToken, DspApiConnectionToken, DspCoreModule, DspViewerModule } from '@dasch-swiss/dsp-ui';
...

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
      // add the following code block
    AppInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppInitService],
      multi: true
    },
    {
      provide: DspApiConfigToken,
      useFactory: () => AppInitService.dspApiConfig
    },
    {
      provide: DspApiConnectionToken,
      useFactory: () => AppInitService.dspApiConnection
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Do not forget to import `APP_INITIALIZER` from `@angular/core` and the desired DSP-UI modules from `@dasch-swiss/dsp-ui`.

Finally, the main.ts file must be modified to load the environment specific config file and test that the config is correct:

```typescript
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

function bootstrapFailed(result) {
  console.error('bootstrap-fail! Config is missing or api parameters are not defined', result);
}

fetch(`config/config.${environment.name}.json`)
  .then(response => response.json())
  .then(config => {
    if (!config) {
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

For more usage examples, check the corresponding DSP-UI module documentation.

* * *

## Contribute to develop DSP-UI modules

If you want to contribute to develop DSP-UI modules with us, please consult the [contribution guideline](/developers/dsp-ui/contribution/).

* * *

DSP-API and DSP-UI-LIB are [free software](http://www.gnu.org/philosophy/free-sw.en.html), released under [GNU Affero General Public](http://www.gnu.org/licenses/agpl-3.0.en.html) license.

It is developed by the design team of the [Data and Service Center for the Humanities DaSCH](http://dasch.swiss) at the [University of Basel](http://unibas.ch).
