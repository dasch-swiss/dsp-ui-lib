# Search results (Component)

The search-results gets the search mode and parameters from routes or inputs, and returns the corresponding resources that are displayed in a list or a grid. The results can be filtered by project.

## List of parameters

- complexView (optional)
- searchQuery (optional)
- searchMode (optional)
- projectIri (optional)

***

## Simple search results example

### HTML file

```html
<kui-search-results></kui-search-results>
```

![Simple search results example](../../../../assets/images/dsp-ui/search-results-simple.png)

## Search results filtered by project example

### HTML file

```html
<kui-search-results [projectIri]="projectIri"></kui-search-results>
```

### Typescript file

```ts
export class SearchResultsComponent {

    projectIri = 'http://rdfh.ch/projects/0001';  // project iri

    constructor() { }
}
```

![Search results filtered by project example](../../../../assets/images/dsp-ui/search-results-filter.png)

## Search results providing search mode and query parameters example

### HTML file

```html
<!-- example of an extended search where we pass a gravsearch query as search parameter -->
<kui-search-results [searchMode]="'extended'" [searchQuery]="gravsearch"></kui-search-results>
```

### Typescript file

```ts
export class SearchResultsComponent {

    gravsearch: string = `PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
                        CONSTRUCT {
                        ?mainRes knora-api:isMainResource true .
                        } WHERE {
                        ?mainRes a knora-api:Resource .
                        ?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/simple/v2#BlueThing> .
                        }
                        OFFSET 0`;

    constructor() { }
}
```

![Search results providing search mode and query parameters example](../../../../assets/images/dsp-ui/search-results-filter.png)
