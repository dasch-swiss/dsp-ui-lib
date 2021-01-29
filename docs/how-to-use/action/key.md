# Key (Pipe)

This pipe can be used for "for loops", in the case of an array with non-numeric indexes.
It returns the key and the value(s). In the example below the `{{item.key}}` contains the index value
and the `{{item.value}}` contains the value(s).

When the value is an object with name and label, you get them with `{{item.value.name}}` and `{{item.value.label}}`.

## Examples

### HTML file

```html
<ul>
    <li *ngFor="let item of array | kuiKey">
        {{item.key}}: {{item.value}}
    </li>
</ul>
```

### Typescript file

```ts
array = [];

this.array['index-1'] = 'Value in index 1';
this.array['index-2'] = 'Value in index 2';
this.array['index-3'] = 'Value in index 3';
```

<iframe src="https://stackblitz.com/edit/knora-key?embed=1&file=src/app/app.component.ts&hideExplorer=1&hideNavigation=1&hidedevtools=1&view=preview" width="700px" height="300px"></iframe>
