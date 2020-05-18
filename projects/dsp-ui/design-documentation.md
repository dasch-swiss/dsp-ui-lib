# Design Documentation

## Viewer Module

### CRUD UI Components

The viewer module provides components to perform CRUD operations. 
These are split into two groups called **value** and **operation** components.
The value components deal with the specifics of each value type supported by Knora, 
the operation components deal with the actual CRUD operations.
With the current design, an operation component can be written in a generic way so it supports all value types.
Hence there is no need to write value specific operation components.
 
#### Value Components

##### Abstract Base Class

Per value type an Angular component has been created. Each of these components is a subclass of the abstract class `BaseValueComponent`. 
A value component knows how to display a value of a given type in the UI and how to update it or create a new value interacting with a user in the UI.

The base classes defines the following members 
(some of them are declared as abstract and have to be implemented in the value components.):
- `@Input abstract displayValue?: ReadValue`: value to be displayed and/or updated, if any. The value has to be a subclass of `ReadValue`.
- `@Input` `mode: 'read' | 'update' | 'create' | 'search'`: sets the mode of the value component.
- members ` abstract valueFormControl: FormControl` for the value and `abstract commentFormControl: FormControl` its comment.
- `abstract getInitValue(): any`: gets the value from the displayValue, if any.
- `getInitComment: : string | null` gets the comment from displayValue, if any.
- `standardValidatorFunc(val: any, comment: string, commentCtrl: FormControl): ValidatorFn`: 
generates a validator that checks if the value changed by the user is different form the existing version (in update mode):
at least the comment has to be different from the previous version.
- `standardValueComparisonFunc(initValue: any, curValue: any): boolean`: method called by `standardValidatorFunc` that checks two given values for equality.
This method has to be overridden for complex types (e.g., interval that is represented as an object).
- `abstract customValidators: ValidatorFn[]`: contains validators for type checking (e.g, to check that a number is an integer).
- `resetFormControl(): void ` resets the values in the `FormControl`s and the validators for the given `mode` and `displayValue`.
- `abstract getNewValue(): CreateValue | false` to get a new value from the form 
- `abstract getUpdatedValue(): UpdateValue | false` to get an updated value from the form

Each value component contains the necessary logic to convert between a `ReadValue` and the representation in the UI
as well as to convert between an edited value in the UI and a `UpdateValue` or `CreateValue`.

##### Simple and Complex Values

`BaseValueComponent` handles most of the logic needed for simple values such as an integer or a URI value.
A value is simple if it can be represented with a primitive type in the `FormControl`. 
An integer value, for instance, can simply be represented as a number in TypeScript.
Complex types, however, have to be represented as an object in the `FormControl`.
An interval, for example, is an object with a start and end that is set in the `FormControl`.
To handle this complexity in the template, the interface [`ControlValueAccessor`](https://material.angular.io/guide/creating-a-custom-form-field-control) has to be implemented.
`ControlValueAccessor` allows to delegate the complexity to a dedicated component that can communicate with the `FormControl`.

Complex value have a so called wrapped component implementing `ControlValueAccessor` that the pass the complex value to.

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
Since these are primitive values, they can be handled directly in the template.

In some case, also primitive values need to be handled using `ControlValueAccessor`.
This is [necessary](https://indepth.dev/never-again-be-confused-when-implementing-controlvalueaccessor-in-angular-forms/) in the case of the color value becasue a third-party lib is used.

#### Operation Components
