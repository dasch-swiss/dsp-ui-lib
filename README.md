# DSP-UI library (knora-ui)


This is the demo and developing environment for DSP-UI library composed of 4 modules.

The modules helps to create a graphical user interface, a web application to use [DSP-API](https://www.knora.org) in a quick and simple way. The modules are written in typescript to use them with [Angular](https://angular.io) (version 8). We decided to style the components and directives with [Angular Material design](https://material.angular.io).

DSP-UI library implements [DSP-API-JS-LIB](https://www.npmjs.com/package/@knora/api) to connect with the Knora web API. DSP-API is a software framework for storing, sharing, and working with primary sources and data in the humanities.

DSP-API and the DSP-UI library is [free software](http://www.gnu.org/philosophy/free-sw.en.html), released under the [GNU Affero General Public](http://www.gnu.org/licenses/agpl-3.0.en.html).

This version of DSP-UI requires [DSP-API version ^12.0.0](https://github.com/dasch-swiss/knora-api/releases/tag/v12.0.0).

## Library modules

### DSP-UI/core

The core module contains configuration files and all variables needed to connect the DSP API.
[read more...](https://dasch-swiss.github.io/knora-ui/modules/core)

* * *

### DSP-UI/search

Search module allows to make simple searches or extended searches in DSP-API. In the extended search, resource class and its properties related to one specific ontology are selected to create your query.
[read more...](https://dasch-swiss.github.io/knora-ui/modules/search)

* * *

### DSP-UI/viewer

The viewer module contains object components to show the resource class representations from DSP-API, the gui-elements for the property values and different kind of view frameworks.
[read more...](https://dasch-swiss.github.io/knora-ui/modules/viewer)

* * *

### DSP-UI/action

The action module contains special buttons (e.g. to sort a list), pipes and directives.
[read more...](https://dasch-swiss.github.io/knora-ui/modules/action)

* * *

## Developers note

### Prerequisites

We develop the DSP-UI modules with Angular 8, especially with Angular-cli, which requires the following tools:

#### Node.js / NPM

We use [npm](https://nodejs.dev/an-introduction-to-the-npm-package-manager) instead of yarn. Node.js may be already installed on your computer. You can check:

```bash
$ node -v
$ npm -v
```

Install [Node](https://nodejs.org/en/download/) that includes npm in version 10.9.0 or later: 

```bash
$ brew install node
```

For other platforms, please go to the Node.js website.

The easiest way to install node
in the correct version is to use ['n'](https://github.com/tj/n):

```bash
$ npm install -g n
$ n v10.9.0
```

### First steps

Install the node packages with:

```bash
$ npm install
```

and build the library with:

```bash
$ npm run build-lib
```

### Develop

If you want to add more components, services and so on to a module of the library, you can do it with:

`$ ng generate component [path/in/your/module/][name-of-component] --project knora-ui --styleext scss --prefix kui`

Before testing the new component inside of the demo app, you have to rebuild after each change: `ng build knora-ui`.

#### Run the DSP-UI Demo Application

Run the app with `ng s`. The demo app runs on <http://0.0.0.0:4200> and we use it for documentation on [Knora-ui Github page](https://dasch-swiss.github.io/knora-ui).

There's a test environment for the modules on <https://github.com/dhlab-basel/knora-ui-playground> with yalc.

* * *

#### YALC

> Better workflow than `npm` \| `yarn` link for package authors.

Yalc publishes the packages to a local store (not the npm website).
From there, the packages can be added to your depending project.

#### Install [yalc](https://github.com/whitecolor/yalc):

```bash
$ npm i yalc -g
```

#### Usage

Publish library to local store:

```bash
$ npm run build-app
$ npm run yalc-publish
```

Use them in your application:

```bash
$ yalc add knora-ui
```

To remove from the project and restore `package.json` run:

```bash
$ yalc remove --all
```

## Running the application in productive mode
To simulate circumstances of production, the application should be built with optimization and served locally 
(not in dev mode, but from a local web server).

- install `nginx` on your system, e.g. `brew install nginx` for mac OS. See the docs for more information: <https://linux.die.net/man/8/nginx>.
- create a configuration file for the test application.
  The example defines a configuration file `/usr/local/etc/nginx/servers/knorauiapp.conf` for macOS.
  Substitute `$abs_path_to_lib` for the actual absolute path on your system pointing to the project root.
  Substitute `$knora-ui-ng-lib_folder_name` for the folder name of the app build in `dist`.

    ```nginx
        server {
                listen 8090;
                server_name knorauiapp.local;
                root /$abs_path_to_lib/dist/$knora-ui-ng-lib_folder_name;
    
                location / {
                         try_files $uri $uri/ /index.html;
                }
    
            access_log /usr/local/etc/nginx/logs/knorauiapp.local.access.log;
        }
    ```

- add an entry to your `/etc/hosts`: `127.0.0.1	knorauiapp.local`
- create an empty file `knorauiapp.local.access.log` in `/usr/local/etc/nginx/logs` 
  (you might have to create the folder `logs` first)
- start `nginx` (if `nginx` is already running, stop it first: `nginx`: `nginx -s stop`)
- build the library: `npm run build-lib`
- build the test app with optimization: `npm run build-app`
- access <http://knorauiapp.local:8090>



