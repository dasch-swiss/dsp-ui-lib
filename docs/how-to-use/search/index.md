# DSP-UI SEARCH module

DspSearchModule allows to make simple searches or advanced searches in DSP-API. In advanced search, resource class and its properties related to one specific ontology are selected to create your query. It is also possible to write Gravsearch queries to target specific data with the expert search form.

## Prerequisites

For help getting started with a new Angular app, check out the [Angular CLI](https://cli.angular.io/).

For existing apps, follow these steps to begin using DSP-UI SEARCH.

## Installation

DspSearchModule is part of @dasch-swiss/dsp-ui, follow [the installation guide](/how-to-use/getting-started/).

## Components

This module contains various components to search. The main component is the dsp-search-panel, which contains the dsp-fulltext-search, dsp-advanced-search and dsp-expert-search. All of them can be used standalone or in combination in dsp-search-panel.

### [Search panel](/developers/dsp-ui/documentation/search/search-panel)

Fully customizable panel. You can set the following parameters in dsp-search-panel:

- route: string; url-route for search results
- filterbyproject: string; project iri to limit search results by project
- projectfilter: boolean; selection of all projects to filter by
- advanced: boolean; additional menu with advanced search
- expert: boolean;  additional menu with expert search / gravsearch "editor"

If everything is set to false or undefined the search-panel is a simple full-text search. [Read more](modules/search/search-panel)

### [Full-text search (Deprecated)](/developers/dsp-ui/documentation/search/fulltext-search)

`<dsp-fulltext-search [route]="/search-results"></dsp-fulltext-search>`

The parameter `route` defines the route where the search-results-component of the app is defined.

We suggest to define a route for the search-results in the app.routing

```typescript
        path: 'search',
        component: SearchComponent,         // --> Component with the search panel
        children: [
            {
                path: ':mode/:q/:project',
                component: SearchResultsComponent       // --> search results, in case of paramter filterByProject and/or projectFilter
            },
            {
                path: ':mode/:q',
                component: SearchResultsComponent
            }
        ]
```

### [Extended / advanced search](/developers/dsp-ui/documentation/search/extended-search)

Generic search filter tool to limit search results to ontology and resource class and / or properties.

If you want to use this search, you have to add the following css style to your main app stylesheet to style the date picker properly.

```css
.mat-datepicker-content {
  .mat-calendar {
    height: auto !important;
  }
}
```

### [Expert search](/developers/dsp-ui/documentation/search/expert-search)

Expert search is a textarea input field in which you can create Gravsearch queries.
The expert search can be more powerful than the advanced search, but requires knowing how to use the query language Gravsearch (based on SparQL and developed by the DaSCH team). With Gravsearch, expert users can build searches by combining text-related criteria with any other criteria.

Check the [Gravsearch learning guide](https://docs.knora.org/paradox/03-apis/api-v2/query-language.html) on DSP-API documentation.

## Setup

Import the search module in your app.module.ts and add it to the NgModules's imports:

```javascript
import { AppComponent } from './app.component';
import { DspCoreModule, DspSearchModule } from '@dasch-swiss/dsp-ui';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        DspCoreModule, // <- core module is required for some components and directives
        DspSearchModule // <- add search module in the imports
    ],
    providers:  [ ... ]    // <-- add providers as mentioned in the installation guide
    bootstrap: [AppComponent]
})
export class AppModule {
}
```

The search components need a global styling in the app to override some material styling rules. Please update your `angular.json` file as follow:

```json
...
    "styles": [
        "src/styles.scss",
        "node_modules/@dasch-swiss/dsp-ui/search/assets/style/search.scss" // <- add this line
    ],
...
```

<!-- ## Usage
TODO: fill in this section with an example -->
