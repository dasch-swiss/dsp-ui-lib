# DSP-UI ACTION module

[![npm (scoped)](https://img.shields.io/npm/v/@dasch-swiss/dsp-ui)](https://www.npmjs.com/package/@dasch-swiss/dsp-ui)

DspActionModule is like a tool box containing special pipes to sort lists or to get the index key in arrays, directives for images and sorting names, but also components to display progress indicator bars or customized dialog boxes for resources, etc...

## Prerequisites

For help getting started with a new Angular app, check the [Angular CLI](https://cli.angular.io/) documentation.

For existing apps, follow these steps to begin using DSP-UI ACTION.

## Installation

DspActionModule is part of @dasch-swiss/dsp-ui, follow [the installation guide](/developers/dsp-ui/documentation/#installation).

## Setup

 Import the action module in your app.module.ts and add it to the NgModules's imports:

```javascript
import { AppComponent } from './app.component';
import { DspCoreModule, DspActionModule } from '@dasch-swiss/dsp-ui';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        DspCoreModule, // <- core module is required for some components and directives
        DspActionModule // <- add action module in the imports
    ],
    providers:  [ ... ]    // <-- add providers if you use the core module as mentioned in the installation guide
    bootstrap: [AppComponent]
})
export class AppModule {
}
```

Some components need a global styling in the app to override some material styling rules. Please update your `angular.json` file as follow:

```json
...
    "styles": [
        "src/styles.scss",
        "node_modules/@dasch-swiss/dsp-ui/action/assets/style/action.scss" // <- add this line
    ],
...
```

<!-- ## Usage
TODO: fill in this section with an example -->

## Components, Directives and Pipes

This module contains various components like a progress indicator, sort button and sort-by pipe, but also helper for images (in the admin interface) and existing names.
