# Full-text search (Component) - DEPRECATED

Input field to perform a full text search.

## Parameters

Name | Type | Description
--- | --- | ---
route | string | Route to navigate after search. This route path should contain a component for search results.
projectfilter (optional) | boolean | If true it shows the selection of projects to filter by one of them
filterbyproject (optional) | string | If the full-text search should be filtered by one project, you can define it with project iri.

## Examples

### Simple full-text search

```html
<!-- param route is where the router-outlet is defined for search results -->
<dsp-fulltext-search [route]="'/search'"></dsp-fulltext-search>

<router-outlet></router-outlet>
```

![Simple full-text search](../../assets/images/fulltext-search-simple.png)

### Full-text search with project filter

```html
<!-- param route is where the router-outlet is defined for search results -->
<dsp-fulltext-search [route]="'/search'" [projectfilter]="true"></dsp-fulltext-search>

<router-outlet></router-outlet>
```

![Full-text search with project filter](../../assets/images/fulltext-search-with-project-filter.png)
