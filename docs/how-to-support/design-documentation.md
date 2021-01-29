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

### Resource View Component

The `ResourceViewComponent` initially gets a resource and passes the retrieved information to its child components to deal with the values.
As the user adds more values, edits existing ones etc., these changes are reflected in `ResourceViewComponent.resPropInfoVals`.
*This means the `ResourceViewComponent.resource` that was initially retrieved still represents the state of the past since its values are not updated.*
Therefore, `ResourceViewComponent.resPropInfoVals` is used solely to represent a resource's values in the template.

When updating, adding, or deleting an XML text value, an additional request is performed to retrieve the resource's standoff link values
which are then updated in `ResourceViewComponent.resPropInfoVals`.

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
- `@Input() valueRequiredValidator?`: controls if the value should be required. Defaults to true.
- members `abstract valueFormControl: FormControl` for the value and `abstract commentFormControl: FormControl` its comment.
- `abstract getInitValue(): any`: gets the value from the displayValue, if any.
- `getInitComment: : string | null` gets the comment from displayValue, if any.
- `standardValidatorFunc(val: any, comment: string, commentCtrl: FormControl): ValidatorFn`:
generates a validator that checks if the value changed by the user is different from the existing version (in update mode):
the comment has to at least be different from the previous version for the value to be valid.
- `standardValueComparisonFunc(initValue: any, curValue: any): boolean`: method called by `standardValidatorFunc` that checks two given values for equality.
This method has to be overridden for complex types (e.g., an interval, which is represented as an object).
- `abstract customValidators: ValidatorFn[]`: contains validators for type checking (e.g, to check that a number is an integer).
- `resetFormControl(): void` resets the values in the `FormControl`s and the validators for the given `mode` and `displayValue`.
- `abstract getNewValue(): CreateValue | false` gets a new value from the form.
- `abstract getUpdatedValue(): UpdateValue | false` gets an updated value from the form.
- `isEmptyVal(): boolean`: checks if the value is empty.

Each value component contains the necessary logic to convert between a `ReadValue` and the representation in the UI
as well as to convert between an edited value in the UI and a `UpdateValue` or `CreateValue`.

##### Validation

Each value component creates a form and sets the appropriate validators that can be data type specific.
By default, a value is required and cannot be empty, i.e., the `Validators.required` is set.
The default behaviour can be changed by setting `@Input: valueRequiredValidator` to false,
in which case empty values are allowed.

Note that the method `getNewValue()` will filter out empty values,
i.e., return `false` instead of an instance of `CreateValue`.

This is used in the event that a user should be able to submit a form without filling out every form field.

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
They are responsible for the communication with the Knora API using `@dasch-swiss/dsp-js` when updating or creating a value.

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

#### Integration of CKEditor

### General Setup

To edit XML, the viewer module relies on CKEditor. `TextValueAsXMLComponent` integrates the CKEditor library for Angular.
In addition, a custom build of CKEditor is needed which is accessible on [GitHub](https://github.com/dasch-swiss/ckeditor_custom_build).
To make a new custom build, follow the [instructions](https://github.com/dasch-swiss/ckeditor_custom_build/blob/master/how-to-build.md).

Note that currently only the standard mapping is supported.

### Handling Internal Links When Displaying Text

When a text created with CKEditor is shown in read-mode, click and hover events on internal links can be reacted to by applying the directive `TextValueHtmlLinkDirective` with the selector `dspHtmlLink`.
Internal links have the class "salsah-link".

## Search Module

The search module allows different ways of searching in order to make simple or complex searches in DSP-API.
This module contains various components you can use to search and all of them can either be used individually or in combination with one another using the search panel.

### Search-panel

This is a fully-customizable panel that allows you to assemble the search components and the filters you need in a configurable way. You can set the following parameters defined as `@Inputs` in dsp-search-panel:

- route: string; url-route for search results
- filterbyproject: string; project iri to limit search results to a specific project
- projectfilter: boolean; provides a drop-down menu of all available projects allowing the user to choose which project to search in
- advanced: boolean; additional menu with advanced / extended search
- expert: boolean;  additional menu with expert search / Gravsearch "editor"

If everything is set to false or undefined, the search-panel will be a simple full-text search.

### Fulltext search

The full text search quickly finds all instances of a term in DSP-API. It can be restricted to a certain project.

### Expert search

The expert search is a textarea which allows you to manually write Gravsearch queries if you are comfortable with the language and want more precise results. The textarea content contains a default Gravsearch query as an example for the user. It is possible to reset the field back to the default query.

### Advanced search

The advanced search is a search form that allows for the specification of a resource class and and the values of its properties
to create a Gravsearch query.

#### Structure

The advanced search consists of the following components:

- `AdvancedSearchComponent`: Main form: Reset and submit buttons, buttons to add and remove properties.
  - `SelectOntologyComponent`: Select an ontology from a list.
  - `SelectResourceClassComponent`: Select a resource class from a list.
  - `SelectPropertyComponent`: Select a property from a list.
    - `SpecifyPropertyValueComponent`: Specify a comparison operator and a value for a chosen property.
      - `SearchBooleanValueComponent`: Specify a Boolean value.
      - `SearchDateValueComponent`: Specify a date value.
      - `SearchDecimalValueComponent`: Specify a decimal value.
      - `SearchIntegerValueComponent`: Specify an integer value.
      - `SearchLinkValueComponent`: Specify the target of a link property.
      - `SearchListValueComponent`: Specify a list value.
        - `SearchDisplayListComponent`: Displays the children of a list node recursively.
      - `TextValueComponent`: Specify a text value.
      - `UriValueComponent`: Specify a URI value.

#### Component Interaction

The `AdvancedSearchComponent`' reacts to the selection of an ontology via the `@Output` of `SelectOntologyComponent`.
When an ontology is selected, `AdvancedSearchComponent` initialises the resource classes and properties of the selected ontology.
These are then displayed with `SelectResourceClassComponent` and `SelectPropertyComponent` respectively.
When initialised, `AdvancedSearchComponent` only shows the ontology selection.

The choice of a resource class is optional. When a resource class is chosen, `AdvancedSearchComponent` reacts to this via the `@Output` of `SelectResourceClassComponent`.
The properties of the chosen resource class are then displayed in `SelectPropertyComponent`. The selection of a resource class can be undone ("no selection").

When a property is chosen, a comparison operator can be specified.
Once a comparison operator is specified other than "EXISTS", a value can be specified using `SpecifyPropertyValueComponent`.
Depending on the value type of the property, `SpecifyPropertyValueComponent` chooses the apt component to let the user enter a value.

#### Form Validation

`AdvancedSearchComponent` creates the main form that is then passed down to the child components.
Each child component that requires form validation creates an own form which is attached to the main form using `addControl` on the main `FormGroup`.
When a component is destroyed or reinitialised, the component's form is removed using `removeControl` on the main `FormGroup`.
**Both adding and removing to and from the main `FormGroup` have to be performed as async tasks
to avoid [check detection errors](https://indepth.dev/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error/)**.

The query can only be submitted if the main form is valid. Some additional logic is handled in `AdvancedSearchComponent`'s method `validateForm`.

#### Query Generation

`AdvancedSearchComponent` gets the IRI of the specified resource class, if any.
It also gets an array of properties with their values (`PropertyWithValue[]`) to search for.
These are then converted to a Gravsearch query using a service.
