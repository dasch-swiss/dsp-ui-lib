# DSP-UI-LIB &mdash; A library to easily create Knora/DSP Apps

[![npm version](https://badge.fury.io/js/%40dasch-swiss%2Fdsp-ui.svg)](https://www.npmjs.com/package/@dasch-swiss/dsp-ui)
[![CI](https://github.com/dasch-swiss/knora-ui-ng-lib/workflows/CI/badge.svg)](https://github.com/dasch-swiss/knora-ui-ng-lib/actions?query=workflow%3ACI)
[![npm downloads](https://img.shields.io/npm/dt/@dasch-swiss/dsp-ui.svg?style=flat)](https://www.npmjs.com/package/@dasch-swiss/dsp-ui)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@dasch-swiss/dsp-ui.svg?style=flat)](https://www.npmjs.com/package/@dasch-swiss/dsp-ui)
[![license](https://img.shields.io/npm/l/@dasch-swiss/dsp-ui.svg?style=flat)](https://www.npmjs.com/package/@dasch-swiss/dsp-ui)


This is the demo and developing environment for DSP-UI-LIB ([@dasch-swiss/dsp-ui](https://www.npmjs.com/package/@dasch-swiss/dsp-ui)) comprised of 4 modules.

The modules help create a GUI to allow the user to use [DSP-API](https://docs.dasch.swiss/developers/knora/api-reference/) in a quick and simple way from within a web application. The modules are written in Typescript for use with [Angular](https://angular.io) (version 9). We decided to style components and directives with [Angular Material design](https://material.angular.io).

DSP-UI-LIB implements [DSP-JS-LIB](https://www.npmjs.com/package/@dasch-swiss/dsp-js) to connect with [DSP-API](https://docs.dasch.swiss/developers/knora/api-reference/). DSP-API is a software framework for storing, sharing, and working with primary sources and data in the humanities.

Please check our [DSP Release Compatibility Matrix](https://docs.google.com/spreadsheets/d/e/2PACX-1vQe-0nFKqYHwHT3cNI2M_ZCycKOgDZBxtaabxEQDDkNKJf6funMVrJBJPgMFEJdiBdCesahUhURN6MS/pubhtml) to use this library with the correct and required versions of the dependent packages.

DSP-API and DSP-UI-LIB are [free software](http://www.gnu.org/philosophy/free-sw.en.html), released under [GNU Affero General Public](http://www.gnu.org/licenses/agpl-3.0.en.html) license.

## Library modules

### DspCoreModule

The core module contains configuration files and all injection tokens needed to connect to DSP-API.
[read more...](https://dasch-swiss.github.io/knora-ui/modules/core)

---

### DspViewerModule

The viewer module contains object components to show the resource class representations from DSP-API, the GUI-elements for the property values and frameworks to display these values in different ways.
[read more...](https://dasch-swiss.github.io/knora-ui/modules/viewer)

---

### DspSearchModule

The search module allows you to make simple or extended searches in DSP-API. In the extended search, resource class and its properties related to one specific ontology are selected to create your query.
[read more...](https://dasch-swiss.github.io/knora-ui/modules/search)

---

### DspActionModule

The action module contains special buttons (e.g. to sort a list), pipes and directives.
[read more...](https://dasch-swiss.github.io/knora-ui/modules/action)

---

## Developers note

### Prerequisites

We develop DSP-UI-LIB modules using Angular 9, with heavy reliance on Angular-cli, which requires the following tools:

#### Node.js

Angular requires a [current, active LTS, or maintenance LTS](https://nodejs.org/about/releases/) version of Node.js. We recommend installing [Node version 12.x](https://nodejs.org/download/release/latest-v12.x/).

On MacOs, install node with [Homebrew](https://brew.sh).
For other platforms, please visit the [Node.js download page](https://nodejs.org/en/download/).

```bash
brew install node@12
```

_Developer hint: To switch between various node versions, we recommand to use [n &mdash; Node.js versions manager](https://www.npmjs.com/package/n)._

To install it, run:

```bash
npm install -g n
```

and switch to the desired node version, e.g. 12.16.2 with `n v12.16.2`

#### NPM package manager

We use [npm](https://docs.npmjs.com/cli/install) instead of yarn, which is installed with Node.js by default.

To check that you have the npm client installed, run `npm -v`.

### First steps

Install the node packages with:

```bash
npm install
```

and build the library with:

```bash
npm run build-lib
```

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

### Run the DSP-UI-LIB Demo Application

Run the app with the command line: `npm run start`.

The demo app runs on <http://0.0.0.0:4200>.

Documentation can be found on [DSP-UI-LIB Github page](https://dasch-swiss.github.io/knora-ui).

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
 - open a new tab and `run npm run start` from the project root directory
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

### Publish a new version to NPM

A new version will be published with each github release as it's part of Github actions' workflow. Please follow the steps below to prepare the next release:

- Create new branch from master called e.g. `prerelease/v1.0.0-rc.2` or `release/v2.0.0`
- Run one of the corresponding make commands:
  - `next-release-candidate`         updates version to next release candidate e.g. from 3.0.0-rc.0 to 3.0.0-rc.1 or from 3.0.0 to 3.0.1-rc.0
  - `prerelease-major`               updates version to next MAJOR as release candidate e.g. from 4.0.0 to 5.0.0-rc.0
  - `prerelease-minor`               updates version to next MINOR as release-candidate e.g. from 3.1.0 to 3.2.0-rc.0
  - `prerelease-patch`               updates version to next PATCH as release-candidate e.g. from 3.0.1 to 3.0.2-rc.0
  - `release-major`                  updates version to next MAJOR version e.g. from 3.0.0 to 4.0.0
  - `release-minor`                  updates version to next MINOR version e.g. from 3.0.0 to 3.1.0
  - `release-patch`                  updates version to next PATCH version e.g. from 3.0.0 to 3.0.1
- The make command will commit and push to github
- Update README and CHANGELOG if necessary and commit the changes
- Create new pull request and merge into master
- Draft new release on Github. This will build, test and publish the new package on npm. Additional it creates / overrides release notes on Github.

New package will be available on <https://www.npmjs.com/package/@dasch-swiss/dsp-ui>
