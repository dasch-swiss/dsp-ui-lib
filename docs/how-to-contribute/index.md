# How to Contribute to this Project

If you are interested in contributing to this project,
please read our [general DSP contribution guidelines](https://docs.dasch.swiss/developers/dsp/contribution/) first.

## Structure of this Project

This project consists of two main parts:

1. The Angular library `DSP-UI (@dasch-swiss/dsp-ui)` in `project/dsp-ui`.
1. The demo Angular Application (Playground) in `src/app`.

The Angular library contains the code that is published on NPM.
The demo Angular application's purpose is to demonstrate the library's functionality.
The library needs to be built first in order to use it within the demo application.

The demo application uses the **locally built version** of `@dasch-swiss/dsp-ui`
which is configured in [tsconfig.json](https://github.com/dasch-swiss/dsp-ui-lib/blob/main/tsconfig.json) (`compilerOptions.paths`),
see [Angular docs](https://angular.io/guide/creating-libraries#building-and-rebuilding-your-library).

## Prerequisites

### Node.js

Angular requires a [current, active LTS, or maintenance LTS](https://angular.io/guide/setup-local#prerequisites) version of Node.js.

We recommend using [n](https://www.npmjs.com/package/n),
a tool that installs and manages Node.js versions on your local system.

### NPM package manager

Angular requires the [npm package manager](https://angular.io/guide/setup-local#prerequisites).

### DSP-API

The demo application requires a running instance of
[DSP-API (Knora)](https://docs.knora.org/04-publishing-deployment/getting-started/)
compatible with the version defined in [vars.mk](https://github.com/dasch-swiss/dsp-ui-lib/blob/main/vars.mk): {% include-markdown "../../vars.mk" %}

## First Steps

Clone this repository:

```shell
git clone https://github.com/dasch-swiss/dsp-ui-lib/
```

Install the dependencies with:

```shell
npm install
```

Build the library with:

```shell
npm run build-lib
```

Run the demo application:

```shell
ng s
```

And access `http://localhost:4200` in your browser.

## Scripts For Development

The following scripts can be used for development:

### Testing

- `npm test`: runs the unit tests of the demo application and the lib's unit tests.
- `npm test-lib`: runs the lib's unit tests in headless mode (no browser UI).
- `npm test-lib-local`: runs the lib's unit test with the browser UI (for local development of the lib).
- `npm run webdriver-update`: installs Chrome webdriver in the required version for the E2E tests.
- `npm run e2e`: runs the E2E tests from the demo application, see section [Unit Tests and E2E Tests](#unit-tests-and-e2e-tests).

### Building

- `npm run build-lib`: builds the lib in productive mode
- `npm run build-lib-dev`: builds the lib in development mode
- `npm build-app`: builds the demo application in productive mode
- `npm run yalc-publish-lib`: builds the lib and publishes it locally using [yalc](https://www.npmjs.com/package/yalc).

## Library Build Options

The library is built in productive mode for publication, using [tsconfig.lib.prod.json](https://github.com/dasch-swiss/dsp-ui-lib/blob/main/projects/dsp-ui/tsconfig.lib.prod.json).

To perform additional checks during development, the library can be built in development mode,
using [tsconfig.lib.json](https://github.com/dasch-swiss/dsp-ui-lib/blob/main/projects/dsp-ui/tsconfig.lib.json). Development builds use Ivy and perform [strict template checks](https://angular.io/guide/template-typecheck#template-type-checking).

## Unit Tests and E2E Tests

There are unit tests for the lib (`projects/dsp-ui/src`)
and some basic unit tests for the demo application playground components (`src/app`).

The E2E tests have to be run from the demo application.
Unlike the unit tests, they require a running instance of DSP-API compatible with the release specified in [vars.mk](https://github.com/dasch-swiss/dsp-ui-lib/blob/main/vars.mk): {% include-markdown "../../vars.mk" %}
Before running the E2E tests, reload the data in DSP-API's db.
The E2E tests can be run as follows:

- `npm run webdriver-update`
- `npm run e2e`

## DSP-UI Library Developement

### Adding New Components etc. to the Library

Install [Angular CLI](https://angular.io/cli) globally:

```shell
 npm install -g @angular/cli
```

To add additional components etc. to a module of the library, run:

```shell
ng generate component [path/in/the/module/][name-of-component] --project @dasch-swiss/dsp-ui
```

For example, to create a new component `test` in the action module, run:

```shell
ng generate component action/test --project @dasch-swiss/dsp-ui
```

This command will create a folder called `test` inside of `projects/dsp-ui/src/lib/action/` containing the component's class, template, style, and spec files.

Before testing the new component inside of the demo app, you have to rebuild it after each change:

```shell
npm run build-lib
```

Alternatively, you can use [Live Reloading](#run-the-application-locally-in-dev-mode-with-live-reloading).

## Demo Application (Playground)

### Adding New Component to the Demo Application

The demo app demonstrates the functionality of dsp-ui-lib's modules.
By default, the demo app's main component routes to the page demonstrating the resource viewer in read mode.

Before adding a new component to the demo app,
check if the desired demo could be added to an existing component of the demo app.

Follow these steps to add a new component to the demo app:

- create a new component in the demo app:
  - create a new component using Angular CLI in `src/app`
  - demonstrate a part of dsp-ui-lib (component, service etc.) in the new component of the demo app
- in `AppRoutingModule` and `AppComponent`'s template, set up the routing for your new component in the demo app.

### Run the Application Locally in Dev Mode With Live Reloading

To make changes to the DSP-UI and have your changes reflected immediately upon saving, follow these steps:

- run `npm run build-watchful-lib-dev` from the project root directory
- open a new tab and run `npm run start` from the project root directory
- now, anytime you make a change to DSP-UI and save, the library will be re-built and the webpage will refresh and you will see the changes

### Run the Application in Productive Mode

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

### Build and Run the Application in Docker

To build and run the application in Docker, do the following:

1. `docker build --tag app:0.1 .` (you can use any tag name you want)
2. `docker run -v ~/localdir/config.prod.json:/public/config/config.prod.json --publish 4200:4200 --detach --name myname app:0.1`

The first step builds the lib and app in Docker. Make sure to delete the contents of the `dist` folder on your local system first.

The second step runs a container based on the image built in the previous step:

- `-v` mounts a config file from your local file system in the Docker container, so you can set the config.
- `--publish` maps the port on your local machine to the port in the Docker container.

You can now access the app on your local machine under <http://localhost:4200/>.

## Architecture of the Library

See [design documentation](./design-documentation.md).

## Local Publishing of DSP-UI

The demo application uses the locally built version of DSP-UI, see the repository's [structure](#structure-of-this-project).

If you want to install an unpublished version of DSP-UI in your Angular application, you can use [yalc](https://www.npmjs.com/package/yalc).
`yalc` publishes DSP-UI to a local store.

Install `yalc`:

```shell
npm install yalc -g
```

Build the library and publish it to the local store:

```shell
npm run build-app
npm run yalc-publish-lib
```

Add the local build your Angular application:

```shell
yalc add @dasch-swiss/dsp-ui
npm install
```

To remove it from your project and restore `package.json`, run:

```shell
yalc remove --all
```

## Publish a New Version of the Library to NPM

Please follow the general DSP documentation about the release process: [prepare](https://docs.dasch.swiss/developers/dsp/contribution/#prepare-release) and [publish](https://docs.dasch.swiss/developers/dsp/contribution/#create-release).

Before publishing:

- Update documentation if necessary and commit the changes

- Be sure that all dependencies to DSP-JS-LIB and DSP-API are set to the correct version:
  - Update DSP-API version in `vars.mk`
  - Update DSP-JS version in `package.json` and run `npm install` to update the `package-lock.json`
  - Update DSP-JS version in section `peerDependencies` of `projects/dsp-ui/package.json`

A new version will be published with each github release as it's part of github actions' workflow. To make a new release, you have to merge the open release PR as described [here](https://docs.dasch.swiss/developers/dsp/contribution/#create-release).

The new package will be available on <https://www.npmjs.com/package/@dasch-swiss/dsp-ui>.
