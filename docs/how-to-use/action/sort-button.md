# SortButton (Component)

A component with a list of properties to sort a list by one of them.
It can be used together with the KuiSortBy pipe.

## Parameters

{string} sortKeyChange <br>
EventEmitter when a user selected a sort property; <br>
This is the selected key.

Name | Type | Description
--- | --- | ---
sortProps | Array<SortProp> | An array of SortProp objects for the selection menu: <br> SortProp: { key: string, label: string }
position='left' (optional) | string | Optional position of the sort menu: right or left
icon='sort' (optional) | string | Default icon is "sort" from material design. But you can replace it with another one e.g. sort_by_alpha
sortKey | string | Set and get (two-way data binding) of current sort key

## Example - Simple Example

### HTML file

```html
<kui-sort-button [sortProps]="sortProps" [(sortKey)]="sortKey" [position]="'right'"></kui-sort-button>

<ul>
    <li *ngFor="let item of list | kuiSortBy: sortKey">
        <span [class.active]="sortKey === 'prename'">{{item.prename}} </span>
        <span [class.active]="sortKey === 'lastname'">{{item.lastname}} </span>
        by
        <span [class.active]="sortKey === 'creator'">{{item.creator}}</span>
    </li>
</ul>
```

### Typescript file

```ts
sortProps: any = [
    {
        key: 'prename',
        label: 'Prename'
    },
    {
        key: 'lastname',
        label: 'Last name'
    },
    {
        key: 'creator',
        label: 'Creator'
    }
];

sortKey: string = 'creator';

list = [
    {
        prename: 'Gaston',
        lastname: 'Lagaffe',
        creator: 'André Franquin'
    },
    {
        prename: 'Mickey',
        lastname: 'Mouse',
        creator: 'Walt Disney'
    },
    {
        prename: 'Donald',
        lastname: 'Duck',
        creator: 'Walt Disney'
    },
    {
        prename: 'Charlie',
        lastname: 'Brown',
        creator: 'Charles M. Schulz'
    }
];
```

<iframe src="https://stackblitz.com/edit/knora-sort-button?embed=1&file=src/app/app.component.ts&hideExplorer=1&hideNavigation=1&hidedevtools=1&view=preview" width="700px" height="300px"></iframe>

### Optional

It's possible to set the position of the sort button to the right or left side with the property `[position]`.
