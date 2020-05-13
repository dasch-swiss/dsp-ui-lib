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

Per value type an Angular component has been created. Each of these components is a subclass of the abstract class `BaseValueComponent`. 
A value component knows how to display a value of a given type in the UI and how to update it or create a new value interacting with a user in the UI.

The base classes defines the following members 
(some of them are declared as abstract and have to be implemented in the value components.):
- `@Input abstract displayValue?: ReadValue`: value to be displayed and/or updated, if any. The value has to be a subclass of `ReadValue`.
- `@Input` `mode: 'read' | 'update' | 'create' | 'search'`: sets the mode of the value component.
- abstract members `valueFormControl: FormControl` for the value and `abstract commentFormControl: FormControl` its comment.
- `abstract getInitValue(): any`: gets the value from the displayValue, if any.
- `getInitComment: : string | null` gets the comment from displayValue, if any.
- `standardValidatorFunc(val: any, comment: string, commentCtrl: FormControl): ValidatorFn`: 
generates a validator that checks if the value changed by the user is different form the existing version (in update mode).
- `standardValueComparisonFunc(initValue: any, curValue: any): boolean`: method called by `standardValidatorFunc` that checks two given values for equality.
- `abstract customValidators: ValidatorFn[]`: contains validators for type checking (e.g, to check that a number is an integer).
This method has to be overridden for complex types (e.g., interval).
- `resetFormControl(): void ` resets the values in the `FormControl`s and the validators for the given `mode` and `displayValue`.
- `abstract getNewValue(): CreateValue | false` to get a new value from the form 
- `abstract getUpdatedValue(): UpdateValue | false` to get an updated value from the form

#### Operation Components
