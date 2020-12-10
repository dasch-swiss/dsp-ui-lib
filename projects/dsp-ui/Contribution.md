# Contribution

## How to Contribute to this Project

If you are interested in contributing to this project,
please read our [general contribution guidelines](https://docs.dasch.swiss/developers/dsp/contribution/) first.

## Adding New Componentsetc. to the Library

Install [Angular CLI](https://angular.io/cli) globally:

```bash
 npm install -g @angular/cli
```
 
To add additional components etc. to a module of the library, do:

```bash
ng generate component [path/in/the/module/][name-of-component] --project @dasch-swiss/dsp-ui
```

For example, to create a new component `test` in the action module, run:

```bash
ng generate component action/test --project @dasch-swiss/dsp-ui
```

This command will create a folder called `test` inside of `projects/dsp-ui/src/lib/action/`
containing the component's class, template, style, and spec files.

Before testing the new component inside of the demo app, you have to rebuild it after each change:

```bash
npm run build-lib
```

See [repository README](../../README.md#add-a-new-component-to-the-demo-application)
for more information about how to add new components to the demo application.

## Architecture of the Library
See [design documentation](design-documentation.md).

## Local Publishing of DSP-UI-LIB
The demo application uses the locally built version of DSP-JS-LIB, see the repository's [README](../../README.md#Structure of This Project).

If you want to install an unpublished version of DSP-JS-LIB in your Angular application, you can use [yalc](https://www.npmjs.com/package/yalc).
`yalc` publishes DSP-UI-LIB to a local store.

Install `yalc`:

```bash
npm install yalc -g
```

Build the library and publish it to the local store:

```bash
npm run build-app
npm run yalc-publish-lib
```

Add the local build your Angular application:

```bash
yalc add @dasch-swiss/dsp-ui
npm install
```

To remove it from your project and restore `package.json`, run:

```bash
yalc remove --all
```

## Publish a New Version of the Library to NPM

Before publishing:

- Update README if necessary and commit the changes

- Be sure that all dependencies to DSP-JS-LIB and DSP-API are set to the correct version:
  - Update DSP-API version in `vars.mk`
  - Update DSP-JS version in `package.json` and run `npm install` to update the `package-lock.json`
  - Update DSP-JS version in section `peerDependencies` of `projects/dsp-ui/package.json`

A new version will be published with each Github release as it's part of Github actions' workflow.
To make a new release, go to <https://github.com/dasch-swiss/dsp-ui-lib/releases> and update the draft called "Next release" by changing:

- The tag version and the release title (same name) with the version number, e.g. `v3.0.0` or `v3.0.0-rc.0`
- If this is a pre-release, check the box "This is a pre-release"

New package will be available on <https://www.npmjs.com/package/@dasch-swiss/dsp-ui>.

