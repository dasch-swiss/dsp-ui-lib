# @dasch-swiss/dsp-ui

The modules help to create a graphical user interface, a web application to use [DSP-API](https://api.knora.org) in a quick and simple way. The modules are written in Typescript to use them with **[Angular](https://angular.io) (version 9)**. We decided to style components and directives with [Angular Material design](https://material.angular.io).

DSP-UI-LIB implements [DSP-JS-LIB](https://www.npmjs.com/package/@knora/api) to connect with the DSP API. DSP-API is a software framework for storing, sharing, and working with primary sources and data in the humanities.

DSP-API and the DSP-UI-LIB are [free software](http://www.gnu.org/philosophy/free-sw.en.html), released under the [GNU Affero General Public](http://www.gnu.org/licenses/agpl-3.0.en.html).

This version of DSP-UI-LIB **requires [DSP-API version ^12.0.0](https://github.com/dasch-swiss/knora-api/releases/tag/v12.0.0).**

## Installation

```bash
npm install @dasch-swiss/dsp-ui
```

### Dependencies

The module has the following package dependencies, which you also have to install.

<!-- TODO: the following package will be renamed to @dasch-swiss/dsp-js -->
- [@knora/api](https://www.npmjs.com/package/@knora/api)
- [jdnconvertiblecalendar@0.0.5](https://www.npmjs.com/package/jdnconvertiblecalendar)
- [jdnconvertiblecalendardateadapter@0.0.13](https://www.npmjs.com/package/jdnconvertiblecalendardateadapter)
- [ngx-color-picker@9.1.0](https://www.npmjs.com/package/ngx-color-picker)

## Setup

The module supports runtime config to load the API configuration on load and not on build. This helps to run an App as docker image in various environments. But this needs some modifications in your app. We suggest to build the app with [@angular/cli](https://cli.angular.io/).

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

It's possible to create several config files e.g. one for productive use. In this case, `logErrors` should be set to `false` and the filename would be `config.prod.json`. In the environment-files, we have to add the corresponding name:

```typescript
export const environment = {
  name: 'dev',      // <-- add here the name 'dev' or 'prod' etc.
  production: false
};
```

The config files have to been integrated in `angular.json` in all "assets"-sections:

```json
"assets": [
    "src/favicon.ico",
    "src/assets",
    "src/config"    <-- add this line and do not forget the comma above
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

Do not forget to make the imports for `APP_INITIALIZER` from `@angular/core` and the desired DSP-UI modules from `@dasch-swiss/dsp-ui`.

Finally, the `main.ts` file must be modified:

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

<!-- example of component e.g. get all projects and display as a list -->

<!-- example of resource viewer -->

<!-- link to main documentation: https://docs.dasch.swiss/developers/knora-ui/documentation/ -->

## Contribution

If you want to improve the elements and help developing, do not hesitate to [contact us](https://dasch.swiss/team) and read the manual on [docs.dasch.swiss](https://docs.dasch.swiss/developers/knora-ui/contribution/).

The sources for this package are in the [dasch-swiss/dsp-ui](https://github.com/dasch-swiss/knora-ui-ng-lib) repo. Please file issues and pull requests against that repo.
