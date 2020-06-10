# Design Documentation

## Action Module

The action module contains various directives, components, and pipes which can be used with ease by other parts of the library.

### Pipes

#### Array Tranformation

Any pipe relating to the transformation of arrays must be placed in the folder called "array-transformation". Examples include reversing or sorting an array.

#### Formatting

Any pipe relating to formatting must be placed in the folder called "formatting". Examples include returning a string depending on the value of a boolean or returning a formatted date.

#### String Transformation

Any pipe relating to the transformation of strings must be placed in the folder called "string-transformation". For example, a pipe that truncates a string after a certain amount of characters.

## Viewer Module

### CRUD UI Components

The viewer module provides components to perform CRUD operations. 
These are split into two groups called **value** and **operation** components.
The value components deal with the specifics of each value type supported by Knora, 
the operation components deal with the actual CRUD operations.
With the current design, an operation component can be written in a generic way so that it supports all value types.
Therefore, there is no need to write value specific operation components.
 
#### Value Components

##### Abstract Base Class

An Angular component per value type has been created. Each of these components is a subclass of the abstract class `BaseValueComponent`. 
A value component knows how to display a value of a given type in the UI and how to update it or create a new value interacting with a user in the UI.

The base class defines the following members 
(some of them are declared as abstract and have to be implemented in the value components.):
- `@Input abstract displayValue?: ReadValue`: value to be displayed and/or updated, if any. The value has to be a subclass of `ReadValue`.
- `@Input` `mode: 'read' | 'update' | 'create' | 'search'`: sets the mode of the value component.
- members ` abstract valueFormControl: FormControl` for the value and `abstract commentFormControl: FormControl` its comment.
- `abstract getInitValue(): any`: gets the value from the displayValue, if any.
- `getInitComment: : string | null` gets the comment from displayValue, if any.
- `standardValidatorFunc(val: any, comment: string, commentCtrl: FormControl): ValidatorFn`: 
generates a validator that checks if the value changed by the user is different from the existing version (in update mode):
the comment has to at least be different from the previous version for the value to be valid.
- `standardValueComparisonFunc(initValue: any, curValue: any): boolean`: method called by `standardValidatorFunc` that checks two given values for equality.
This method has to be overridden for complex types (e.g., an interval, which is represented as an object).
- `abstract customValidators: ValidatorFn[]`: contains validators for type checking (e.g, to check that a number is an integer).
- `resetFormControl(): void ` resets the values in the `FormControl`s and the validators for the given `mode` and `displayValue`.
- `abstract getNewValue(): CreateValue | false` gets a new value from the form.
- `abstract getUpdatedValue(): UpdateValue | false` gets an updated value from the form.

Each value component contains the necessary logic to convert between a `ReadValue` and the representation in the UI
as well as to convert between an edited value in the UI and a `UpdateValue` or `CreateValue`.

##### Simple and Complex Values

`BaseValueComponent` handles most of the logic needed for simple values such as an integer or a URI value.
A value is considered simple if it can be represented with a primitive type in the `FormControl`. 
An integer value, for instance, can simply be represented as a number in TypeScript.
Complex types, however, have to be represented as an object in the `FormControl`.
An interval, for example, is an object with a start and end that is set in the `FormControl`.
To handle this complexity in the template, the interface [`ControlValueAccessor`](https://material.angular.io/guide/creating-a-custom-form-field-control) has to be implemented.
`ControlValueAccessor` allows the delegation of the complexity to a dedicated component that can communicate with the `FormControl`.

Complex values have a so-called "wrapped component" implementing `ControlValueAccessor` in which they pass the complex value to.

An integer value can be handled directly in the value component's template:

```html
<input matInput [formControlName]="'intValue'" class="value" placeholder="Int value" type="number">
```

In the case of an interval, the value component delegates the complex value to a dedicated component:

```html
<dsp-interval-input [formControlName]="'intervalValue'" class="value" placeholder="Interval value"></dsp-interval-input>
```

`IntervalInputComponent` thus receives an object `Interval` that it handles in its value setter and getter to communicate with the parent `FormControl`'s value:

```ts
@Input()
  get value(): Interval | null {
    const userInput = this.form.value;
    if (userInput.start !== null && userInput.end !== null) {
      return new Interval(userInput.start, userInput.end);
    }
    return null;
  }

  set value(interval: Interval | null) {
    if (interval !== null) {
      this.form.setValue({start: interval.start, end: interval.end});
    } else {
      this.form.setValue({start: null, end: null});
    }
    this.stateChanges.next();
  }
```

`IntervalInputComponent` defines its own `FormControl`s for the interval's start and end. 
Since these are primitive values (numbers), they can be handled directly in the template.

In some cases, primitive values also need to be handled using `ControlValueAccessor`.
This is [necessary](https://indepth.dev/never-again-be-confused-when-implementing-controlvalueaccessor-in-angular-forms/) in the case of the color value because a third-party lib is used.

#### Operation Components

Operation components work with any value. They control the value components' inputs `displayValue` and `mode`.
They are responsible for the communication with the Knora API using `@knora/api` when updating or creating a value.

`DisplayEditComponent` is an operation component that displays an existing value and makes it editable
 if the user has the necessary permissions.

It works for all value types by choosing the apt value component in its template:

```html
<span [ngSwitch]="valueTypeOrClass">
    <dsp-text-value-as-string class="parent-value-component" #displayVal *ngSwitchCase="'ReadTextValueAsString'" [mode]="mode" [displayValue]="displayValue"></dsp-text-value-as-string>
    <dsp-text-value-as-html class="parent-value-component" #displayVal *ngSwitchCase="'ReadTextValueAsHtml'" [mode]="mode" [displayValue]="displayValue"></dsp-text-value-as-html>
    <dsp-int-value class="parent-value-component" #displayVal *ngSwitchCase="constants.IntValue" [mode]="mode" [displayValue]="displayValue"></dsp-int-value>
    ...
</span>
```

The value component's selector is chosen from `valueTypeOrClass`. Since all value components share the same interface, they can all be handled alike.

Value components may have additional specific inputs for configuration that can be handled in `DisplayEditComponent`'s template as well
,e.g., additional configuration of how do display a date.

## Search Module

The search module allows different modes of search, to make simple or complex searches, in DSP-API.
This module contains various components to search. All of them can be used standalone or in combination in the search panel.

### Search-panel

This is a fully customizable panel. You can set the following parameters defined as `@Inputs` in dsp-search-panel:

- route: string; url-route for search results
- filterbyproject: string; project iri to limit search results by project
- projectfilter: boolean; selection of all projects to filter by one of them
- advanced: boolean; additional menu with advanced / extended search
- expert: boolean;  additional menu with expert search / Gravsearch "editor"

If everything is set to false or undefined the search-panel is a simple full-text search.

### Fulltext search

The full text search quickly finds all instances of a term in DSP-API. It can be restricted to a certain project.

### Expert search

The expert search is a textarea to write manually Gravsearch queries when you know the language.

### Advanced search

The advanced search is a search form in which resource class and its properties related to one specific ontology are selected to create a Gravsearch query.
