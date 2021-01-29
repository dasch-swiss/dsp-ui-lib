# Truncate (Pipe)

This pipe can be used to shorten long text by a defined length.

In markup:

`{{ str | kuiTruncate:[24] }}`

or

`{{ str | kuiTruncate:[24, '...'] }}`

The first parameter defines the length where to truncate the string.
Second optional parameter defines the characters to append to the shortened string. Default is `...`.

The advantage of this pipe over the default Angular slice pipe is the simplicity of adding additional characters at the end of the shortened string.
The same construct with Angular slice pipe looks as follow: `{{ (str.length>24)? (str | slice:0:24)+'...':(str) }}`.

## Example - Truncate Pipe

### HTML file

```html
<p>{{longText | kuiTruncate:[24]}}</p>
```

### Typescript file

```ts
longText: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vel pharetra vel turpis nunc eget lorem dolor. Euismod lacinia at quis risus sed vulputate. Ultrices gravida dictum fusce ut placerat orci nulla pellentesque. Tortor consequat id porta nibh venenatis cras. Turpis tincidunt id aliquet risus feugiat in ante metus. Dictum fusce ut placerat orci nulla pellentesque dignissim enim sit. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Mauris sit amet massa vitae tortor condimentum lacinia quis vel. Dictum sit amet justo donec enim diam vulputate. Dignissim convallis aenean et tortor. Ut tellus elementum sagittis vitae et. Pretium viverra suspendisse potenti nullam ac tortor vitae purus faucibus. Eget mauris pharetra et ultrices neque ornare aenean. Diam in arcu cursus euismod. Odio ut enim blandit volutpat maecenas volutpat. Suspendisse interdum consectetur libero id faucibus nisl tincidunt eget. Risus commodo viverra maecenas accumsan.';
```

Output: **Lorem ipsum dolor sit am...**
