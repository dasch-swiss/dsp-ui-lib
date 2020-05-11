# DSP-UI library

This is the demo and developing environment for DSP-UI-LIB library (@dasch-swiss/dsp-ui) composed of 4 modules.

The modules help to create a graphical user interface, a web application to use [DSP-API](https://www.knora.org) in a quick and simple way. The modules are written in Typescript to use them with [Angular](https://angular.io) (version 9). We decided to style components and directives with [Angular Material design](https://material.angular.io).

DSP-UI-LIB implements [DSP-JS-LIB](https://www.npmjs.com/package/@knora/api) to connect with the DSP API. DSP-API is a software framework for storing, sharing, and working with primary sources and data in the humanities.

DSP-API and DSP-UI-LIB are [free software](http://www.gnu.org/philosophy/free-sw.en.html), released under the [GNU Affero General Public](http://www.gnu.org/licenses/agpl-3.0.en.html).

This version of DSP-UI-LIB requires [DSP-API version ^12.0.0](https://github.com/dasch-swiss/knora-api/releases/tag/v12.0.0).

## Library modules

### DspCoreModule

The core module contains configuration files and all variables needed to connect the DSP API.
[read more...](https://dasch-swiss.github.io/knora-ui/modules/core)

---

### DspViewerModule

The viewer module contains object components to show the resource class representations from DSP-API, the GUI-elements for the property values and different kind of view frameworks.
[read more...](https://dasch-swiss.github.io/knora-ui/modules/viewer)

---

### DspSearchModule

Search module allows to make simple searches or extended searches in DSP-API. In the extended search, resource class and its properties related to one specific ontology are selected to create your query.
[read more...](https://dasch-swiss.github.io/knora-ui/modules/search)

---

### DspActionModule

The action module contains special buttons (e.g. to sort a list), pipes and directives.
[read more...](https://dasch-swiss.github.io/knora-ui/modules/action)

---

## Developers note

### Prerequisites

We develop the DSP-UI-LIB modules with Angular 9, especially with Angular-cli, which requires the following tools:

#### Node.js

Angular requires a [current, active LTS, or maintenance LTS](https://nodejs.org/about/releases/) version of Node.js. We recommend to install [Node version 12.x](https://nodejs.org/download/release/latest-v12.x/).

On MacOs, install node with [Homebrew](https://brew.sh).
For other platforms, please visit the [Node.js download page](https://nodejs.org/en/download/).

```bash
brew install node@12
```

_Developer hint: To switch between various node versions, we recommand to use [n &mdash; Node.js versions manager](https://www.npmjs.com/package/n)._

To install it:

```bash
npm install -g n
```
and switch to node version, e.g. 12.16.2 with `n v12.16.2`

#### NPM package manager

We use the [npm](https://docs.npmjs.com/cli/install) instead of yarn, which is installed with Node.js by default.

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

The main component file should look as follow:

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kui-test',
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

Run the app with the command line: `ng s`.

The demo app runs on <http://0.0.0.0:4200> and we use it for documentation on [DSP-UI-LIB Github page](https://dasch-swiss.github.io/knora-ui).

There's an additional test environment for the modules on <https://github.com/dhlab-basel/knora-ui-playground> with yalc.

#### YALC

In some cases we have to work with unpublished npm packages like our own [@knora/api](https://github.com/dasch-swiss/knora-api-js-lib), a JavaScript library that allows a developer to implement the DSP API without knowing technical details about it.
To publish and add local packages we use [yalc](https://www.npmjs.com/package/yalc). Yalc publishes the packages to a local store (not the npm website).
From there, the packages can be added to your depending project.

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

In case of an issue with package-lock.json (e.g. merge conflict) where you have to reset/delete package-lock file, you must consider the following commands in the correct order:

```bash
yalc remove --all
rm -rf node_modules
rm package-lock.json
npm install
yalc add @knora/api
npm install
```

### Run the application in productive mode

To simulate circumstances of production, the application should be built with optimization and served locally
(not in dev mode, but from a local web server).

- Install `nginx` on your system, e.g. `brew install nginx` for mac OS. Check the [documentation](https://linux.die.net/man/8/nginx) for more information.
- Create a configuration file for the test application.
    The example defines a configuration file `/usr/local/etc/nginx/servers/dspuiapp.conf` for macOS.
    Substitute `$abs_path_to_lib` for the actual absolute path on your system pointing to the project root.
    Substitute `$dsp-ui_folder_name` for the folder name of the app build in `dist`.

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
- Access <http://dspuiapp.local:8090>
