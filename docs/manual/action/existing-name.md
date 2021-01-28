# ExistingName (Directive)

With the ExistingNameDirective, we could prevent to use a name which has to be unique but already exists
e.g. get a list of all project shortnames, then we can use this list as existing names;
you can also use it for a list of blacklisted (not allowed) words.

## Methods

### existingNameValidator()
Validation of existing name value. String method (only one value);
Use it in a "formbuilder" group as a validator property.

**Parameters**

Name | Type | Description
--- | --- | ---
valRegexp | RegExp | Only one regular expression value

**Returns**

 |
--- |
ValidatorFn |

### existingNamesValidator()
Validation of existing name values. Array method (list of values)
Use it in a "formbuilder" group as a validator property.

**Parameters**

Name | Type | Description
--- | --- | ---
valArrayRegexp | RegExp | List of regular expression values

**Returns**

 |
--- |
ValidatorFn |

## Examples

### Existing Name Validator

<iframe src="https://stackblitz.com/edit/knora-existing-name?embed=1&file=src/app/app.component.ts&hideExplorer=1&hideNavigation=1&hidedevtools=1&view=preview" width="700px" height="300px"></iframe>

**The following names already exists**
Try to use one of them in the form above and see what happens

- Max
- Peter
- Paul
- John

**HTML file**
```html
<form [formGroup]="form" class="center card">
    <mat-form-field>
        <input matInput
               [formControl]="form.controls['name']"
               [placeholder]="'Name (should be unique)'">
        <mat-hint *ngIf="formErrors.name">
            {{formErrors.name}}
        </mat-hint>
    </mat-form-field>

    <button mat-button color="primary" [disabled]="!form.valid">
        Submit
    </button>
</form>
```

**Typescript file**
```ts
dataMock: string[] = [
    'Max', 'Peter', 'Paul', 'John'
];

// list of existing names
existingNames: [RegExp] = [
    new RegExp('user')
];

// define your form group
form: FormGroup;

// error handling on the defined fields e.g. name
formErrors = {
    'name': ''
};

// error message on the defined fields in formErrors
validationMessages = {
    'name': {
        'required': 'A name is required',
        'existingName': 'This name exists already.'
    }
};

constructor(private _formBuilder: FormBuilder) {

}

ngOnInit() {
    // create a list of names, which already exists
    for (const user of this.dataMock) {
        this.existingNames.push(
            new RegExp('(?:^|\W)' + user.toLowerCase() + '(?:$|\W)')
        );
    }

    // build form
    this.form = this._formBuilder.group({
        'name': new FormControl({
            value: '', disabled: false
        }, [
            Validators.required,
            existingNamesValidator(this.existingNames)
        ])
    });

    // detect changes in the form
    this.form.valueChanges.subscribe(
        data => this.onValueChanged(data)
    );

    this.onValueChanged();
}


onValueChanged(data?: any) {

    if (!this.form) {
        return;
    }

    // check if the form is valid
    Object.keys(this.formErrors).map(field => {
        this.formErrors[field] = '';
        const control = this.form.get(field);
        if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            Object.keys(control.errors).map(key => {
                this.formErrors[field] += messages[key] + ' ';
            });
        }
    });
}
```
