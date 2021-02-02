# StringifyStringLiteral (Pipe)

This pipe stringifies an array of StringLiterals. With the parameter `all`, the pipe concats all values and appends the corresponding language in brackets.

Otherwise the pipe displays the value corresponding to the default language which comes from the user profile (if a user is logged-in) or from the browser. With the predefined language the pipe checks, if a value exists in the array, otherwise it shows the first value.

## Example - StringifyStringLiteral Pipe

### HTML file

```html
<strong>Show all values</strong>
<p>{{labels | dspStringifyStringLiteral:'all'}}</p>

<strong>Show only one value</strong>
<p>{{labels | dspStringifyStringLiteral}}</p>
```

### Typescript file

```ts
labels: StringLiteral[] = '[{"value":"Welt","language":"de"},{"value":"World","language":"en"},{"value":"Monde","language":"fr"},{"value":"Mondo","language":"it"}]';
```

**Show all values**<br>
Welt (de) / World (en) / Monde (fr) / Mondo (it)

**Show only one value**<br>
World
