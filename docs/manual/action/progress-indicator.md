# Progress Indicator (Component)

The progress indicator can be used to show the status of loading something.
This can be the simple loader or in case of submitting data it can show the status (not ready, loading, done or error).

## Parameters

Name | Type | Description
--- | --- | ---
status (optional) | number | [status] is a number and can be used when submitting form data: <br>- not ready: -1 <br> - loading: 0 <br> - done: 1 <br> - error: 400
color=primary (optional) | string | Parameter to customize the appearance of the loader. Hexadecimal color value e.g. #00ff00 or similar color values 'red', 'green' etc.

## Examples

You can use the progress indicator in two ways:

### Classic Loader

#### HTML file

```html
<kui-progress-indicator></kui-progress-indicator>
```

<!-- <iframe src="https://stackblitz.com/edit/mini-examples?embed=1&file=src/main.ts&hideExplorer=1&hideNavigation=1&view=preview" width="700px" height="300px"></iframe> -->

<hr>

### Submit-form-data loader

e.g. as a list style type while submitting form data

![Submit form data loader](../../../../assets/images/dsp-ui/submit-form-data-loader.png)

Angular Material Icons is required. You have to import the style file into your app and add the following line in your main styling file:

`@import url('https://fonts.googleapis.com/icon?family=Material+Icons');`

We recommend to host the Material Icons font in your app e.g. by using the [Material Icons package](https://www.npmjs.com/package/material-icons).

<hr>

### Dynamic example of Submit-form-data loader

![Loader before submit stage](../../../../assets/images/dsp-ui/loader-before-submit-status.png)
![Loader submitting stage](../../../../assets/images/dsp-ui/loader-submitting-status.png)
![Loader after submit stage](../../../../assets/images/dsp-ui/loader-after-submit-status.png)
