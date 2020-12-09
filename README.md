# DSP-UI-LIB &mdash; A library to easily create Knora/DSP Apps

## Introduction

[![npm version](https://badge.fury.io/js/%40dasch-swiss%2Fdsp-ui.svg)](https://www.npmjs.com/package/@dasch-swiss/dsp-ui)
[![CI](https://github.com/dasch-swiss/knora-ui-ng-lib/workflows/CI/badge.svg)](https://github.com/dasch-swiss/knora-ui-ng-lib/actions?query=workflow%3ACI)
[![npm downloads](https://img.shields.io/npm/dt/@dasch-swiss/dsp-ui.svg?style=flat)](https://www.npmjs.com/package/@dasch-swiss/dsp-ui)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@dasch-swiss/dsp-ui.svg?style=flat)](https://www.npmjs.com/package/@dasch-swiss/dsp-ui)
[![license](https://img.shields.io/npm/l/@dasch-swiss/dsp-ui.svg?style=flat)](https://github.com/dasch-swiss/dsp-ui-lib/blob/main/LICENSE)

This is the demo and developing environment for the NPM package [DSP-UI-LIB (@dasch-swiss/dsp-ui)](https://www.npmjs.com/package/@dasch-swiss/dsp-ui).

The modules contained in DSP-UI-LIB help create an [Angular](https://angular.io) application to allow the user to connect to [DSP-API](https://docs.dasch.swiss/developers/knora/api-reference/)
in a quick and simple way.
Components and directives rely on [Angular Material](https://material.angular.io).

DSP-UI-LIB is [free software](http://www.gnu.org/philosophy/free-sw.en.html),
released under [GNU Affero General Public](http://www.gnu.org/licenses/agpl-3.0.en.html) license.

## Structure of This Project 

This project consists of two main parts:
1. The Angular library `DSP-UI-LIB (@dasch-swiss/dsp-ui)` in `project/dsp-ui`.
1. The demo Angular Application (Playground) in `src/app`.

The Angular library contains the code that is published on npm. 
The demo Angular application's purpose is to demonstrate the library's functionality.
The library needs to be built first in order to use it withing the demo application.

The demo application uses the **locally built version** of `@dasch-swiss/dsp-js`
which is configured in [tsconfig.json](tsconfig.json) (`compilerOptions.paths`),
see [Angular docs](https://angular.io/guide/creating-libraries#building-and-rebuilding-your-library).

## Developers notes

### Prerequisites

#### Node.js

Angular requires a [current, active LTS, or maintenance LTS](https://angular.io/guide/setup-local#prerequisites) version of Node.js.

We recommend using [n](https://www.npmjs.com/package/n),
a tool that installs and manages Node.js versions on your local system.

#### NPM package manager

Angular requires the [npm package manager](https://angular.io/guide/setup-local#prerequisites).

#### DSP-API

The demo application requires a running instance of [DSP-API (Knora)](https://docs.knora.org/04-publishing-deployment/getting-started/)
compatible with the version defined in [vars.mk](vars.mk). 

### First steps

Clone this repository:

```bash
git clone https://github.com/dasch-swiss/dsp-ui-lib/
```

Install the dependencies with:

```bash
npm install
```

Build the library with:

```bash
npm run build-lib
```

Run the demo application:

```bash
npm run ng s
```

And access `http://localhost:4200` in your browser.

**When you are developing the library and want to try out things that you have implemented using the demo application,
you always have to rebuild the library.**

### Scripts For Development

The following scripts can be used for development:

#### Testing
- `npm test`: runs the unit tests of the demo application and the lib's unit tests.
- `npm test-lib`: runs the lib's unit tests in headless mode (no browser UI).
- `npm test-lib-local`: runs the lib's unit test with the browser UI (for local development of the lib). 
- `npm run webdriver-update`: installs Chrome webdriver in the required version for the E2E tests.
- `npm run e2e`: runs the E2E tests from the demo application, see section [E2E Tests](README.md#Unit and E2E Tests).

#### Building
- `npm run build`: builds the lib in productive mode, see section [Building the Library](README.md#Building the Library).
- `npm run build-dev`: builds the lib in development mode, see section [Building the Library](README.md#Building the Library).
- `npm build-app`: builds the demo application in productive mode, see also section [Run the application in productive mode](README.md#Run the application in productive mode)
- `npm run yalc-publish-lib`: builds the lib and publishes it locally using `yalc`.

### Library Build Options

The library is built in productive mode for publication, using [tsconfig.lib.prod.json](projects/dsp-ui/tsconfig.lib.prod.json).

To perform additional checks during development, the library can be built in development mode,
using [tsconfig.lib.json](projects/dsp-ui/tsconfig.lib.json). Development builds use Ivy and perform [strict template checks](https://angular.io/guide/template-typecheck#template-type-checking).

### Unit and E2E Tests

There are unit tests for the lib (`projects/dsp-ui/src`)
and some basic unit tests for the demo application playground components (`src/app`). 

The E2E tests have to be run from the demo application.
Unlike the unit tests, they require a running instance of DSP-API compatible with the release specified in [vars.mk](vars.mk).
Before running the E2E tests, reload the data in DSP-API's db.
The E2E test can be run as follows:
- `npm run webdriver-update`
- `npm run e2e`

### Contribution

If you want to add more components, services and so on to a module of the library, you can do it with:

```bash
ng generate component [path/in/the/module/][name-of-component] --project @dasch-swiss/dsp-ui
```

For example:

```bash
ng generate component core/test --project @dasch-swiss/dsp-ui
```

will create a component-folder called `test` inside of `projects/dsp-ui/src/lib/core/` with four files:

- `test.component.scss`
- `test.component.html`
- `test.component.spec.ts`
- `test.component.ts`

The main component file should look as follows:

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dsp-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
```

Before testing the new component inside of the demo app, you have to rebuild after each change:

```bash
npm run build-lib
```

#### YALC

In some cases we have to work with unpublished npm packages like our own [@dasch-swiss/dsp-js](https://github.com/dasch-swiss/knora-api-js-lib), a JavaScript library that allows a developer to implement the DSP API without knowing technical details about it.
To publish and add local packages we use [yalc](https://www.npmjs.com/package/yalc). Yalc publishes the packages to a local store (not the npm website).
From there, the packages can be added to your project.

##### Installation

```bash
npm i yalc -g
```

##### Usage

Publish library to local store:

```bash
npm run build-app
npm run yalc-publish
```

Use them in your application:

```bash
yalc add @dasch-swiss/dsp-ui
npm install
```

To remove from the project and restore `package.json`, run:

```bash
yalc remove --all
```

#### Conflicts

In the event of an issue with package-lock.json (e.g. merge conflict) where you have to reset/delete package-lock file, run the following commands in this exact order:

```bash
yalc remove --all
rm -rf node_modules
rm package-lock.json
npm install
yalc add @dasch-swiss/dsp-js
npm install
```

### Run the application locally in dev mode with Live Reloading

To make changes to the DSP-UI and have your changes reflected immediately upon saving, follow these steps:

- run `npm run build-watchful-lib-dev` from the project root directory
- open a new tab and run `npm run start` from the project root directory
- now, anytime you make a change to DSP-UI and save, the library will be re-built and the webpage will refresh and you will see the changes

### Run the application in productive mode

To simulate a production environment, the application should be built with optimization and served locally
(not in dev mode, but from a local web server).

- Install `nginx` on your system, e.g. `brew install nginx` for mac OS. Check the [documentation](https://linux.die.net/man/8/nginx) for more information.
- Create a configuration file for the test application.
    The example defines a configuration file `/usr/local/etc/nginx/servers/dspuiapp.conf` for macOS.
    Substitute `$abs_path_to_lib` with the actual absolute path on your system pointing to the project root.
    Substitute `$dsp-ui_folder_name` with the folder name of the app build in `dist`.

```nginx
    server {
            listen 8090;
            server_name dspuiapp.local;
            root /$abs_path_to_lib/dist/$dsp-ui_folder_name;

            location / {
                        try_files $uri $uri/ /index.html;
            }

        access_log /usr/local/etc/nginx/logs/dspuiapp.local.access.log;
    }
```

- Add an entry to your `/etc/hosts`: `127.0.0.1 dspuiapp.local`
- Create an empty file `dspuiapp.local.access.log` in `/usr/local/etc/nginx/logs`
    (you might have to create the folder `logs` first)
- Start `nginx` (if `nginx` is already running, stop it first: `nginx`: `nginx -s stop`)
- Build the library: `npm run build-lib`
- Build the test app with optimization: `npm run build-app`
- Access it via <http://dspuiapp.local:8090>

### Build and run the application in Docker

To build and run the application in Docker, do the following:

1. `docker build --tag app:0.1 .` (you can use any tag name you want)
2. `docker run -v ~/localdir/config.prod.json:/public/config/config.prod.json --publish 4200:4200 --detach --name myname app:0.1`

The first step builds the lib and app in Docker. Make sure to delete the contents of the `dist` folder on your local system first.

The second step runs a container based on the image built in the previous step:

- `-v` mounts a config file from your local file system in the Docker container, so you can set the config.
- `--publish` maps the port on your local machine to the port in the Docker container.

You can now access the app on your local machine under <http://localhost:4200/>.

### Add a New Component to the Demo Application (Playground)

The demo app demonstrates the functionality of dsp-ui-lib's modules.
By default, the demo app's main component routes to the page demonstrating the resource viewer in read mode.

Before adding a new component to the demo app,
check if the desired demo could be added to an existing component of the demo app.

Follow these steps to add a new component to the demo app:
- create a new component in the demo app:
    - create a new component using Angular CLI in `src/app`
    - demonstrate a part of dsp-ui-lib (component, service etc.) in the new component of the demo app
- in `AppRoutingModule` and `AppComponent`'s template, set up the routing for your new component in the demo app. 

### Publish a new version to NPM

Before publishing:

- Update README if necessary and commit the changes

- Be sure that all dependencies to DSP-JS-LIB and DSP-API are set to the correct version:
  - Update DSP-API version in `vars.mk`
  - Update DSP-JS version in `package.json` and run `npm install` to update the `package-lock.json`
  - Update DSP-JS version in section `peerDependencies` of `projects/dsp-ui/package.json`

A new version will be published with each Github release as it's part of Github actions' workflow. To make a new release, go to <https://github.com/dasch-swiss/dsp-ui-lib/releases> and update the draft called "Next release" by changing:

- The tag version and the release title (same name) with the version number, e.g. `v3.0.0` or `v3.0.0-rc.0`
- If this is a pre-release, check the box "This is a pre-release"

New package will be available on <https://www.npmjs.com/package/@dasch-swiss/dsp-ui>.
