# Getting started

## Installation

To use this library in your Angular app, install it from NPM:

```bash
npm install @dasch-swiss/dsp-ui
```

## Dependencies

This library has the following peer dependencies, which you also have to meet:

- [@dasch-swiss/dsp-js](https://www.npmjs.com/package/@dasch-swiss/dsp-js)
- [jdnconvertiblecalendar](https://www.npmjs.com/package/jdnconvertiblecalendar)
- [jdnconvertiblecalendardateadapter](https://www.npmjs.com/package/jdnconvertiblecalendardateadapter)
- [ngx-color-picker](https://www.npmjs.com/package/ngx-color-picker)
- [openseadragon](https://openseadragon.github.io/#download)
- [svg-overlay](https://github.com/openseadragon/svg-overlay)
- [@ckeditor/ckeditor5-angular](https://www.npmjs.com/package/@ckeditor/ckeditor5-angular)
- [ckeditor-build](http://github.com/dasch-swiss/ckeditor_custom_build)

## Supported DSP-API Version

The library is compatible with the DSP-API version defined in [vars.mk](https://github.com/dasch-swiss/dsp-ui-lib/blob/main/vars.mk): {% include-markdown "../../vars.mk" %}

The DSP-UI library supports runtime configuration.
The configuration is loaded when your Angular application starts.

In your Angular project, create the file `config.dev.json` inside `src/config/`:

```json
{
  "apiProtocol": "http",
  "apiHost": "0.0.0.0",
  "apiPort": 3333,
  "apiPath": "",
  "jsonWebToken": "",
  "logErrors": true,
  "sipiUrl": "http://0.0.0.0:1024/",
  "geonameToken": "token"
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
 1. Get the [KnoraApiConfig](https://www.npmjs.com/package/@dasch-swiss/dsp-js) instance from the `AppInitService` instance and provide it as `DspApiConfigToken`.
 1. Create a [KnoraApiConnection](https://www.npmjs.com/package/@dasch-swiss/dsp-js) instance with the config and provide it as `DspApiConnectionToken`.  

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
      // return the instance of KnoraApiConfig provided by AppInitService  
      useFactory: (appInitService: AppInitService) => appInitService.dspApiConfig,
      deps: [AppInitService] // depends on AppInitService
    },
    // 3.
    {
      provide: DspApiConnectionToken,
      // create and return an instance of KnoraApiConnection
      useFactory: (appInitService: AppInitService) => new KnoraApiConnection(appInitService.dspApiConfig),
      deps: [AppInitService] // depends on AppInitService
   }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

The contents of the configuration can be accessed via `AppInitService`s member `config`.
Just inject `AppInitService` in your service's or component's constructor.

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
