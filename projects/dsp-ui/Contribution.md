# Contribution

## How to Contribute to this Project

If you are interested in contributing to this project,
please read our [general contribution guidelines](https://docs.dasch.swiss/developers/dsp/contribution/) first.

## Adding New Components, Directives etc. to the Library

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

## Architecture of the Library
See [design documentation](design-documentation.md).

## Yalc

In some cases we have to work with unpublished npm packages like our own [@dasch-swiss/dsp-js](https://github.com/dasch-swiss/knora-api-js-lib), a JavaScript library that allows a developer to implement the DSP API without knowing technical details about it.
To publish and add local packages we use [yalc](https://www.npmjs.com/package/yalc). Yalc publishes the packages to a local store (not the npm website).
From there, the packages can be added to your project.

### Installation

```bash
npm i yalc -g
```

### Usage

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

## Conflicts

In the event of an issue with package-lock.json (e.g. merge conflict) where you have to reset/delete package-lock file, run the following commands in this exact order:

```bash
yalc remove --all
rm -rf node_modules
rm package-lock.json
npm install
yalc add @dasch-swiss/dsp-js
npm install
```

