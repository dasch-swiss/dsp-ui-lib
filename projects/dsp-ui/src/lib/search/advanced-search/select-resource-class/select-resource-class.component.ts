import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResourceClassDefinition } from '@dasch-swiss/dsp-js';
import { Subscription } from 'rxjs';

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);

@Component({
    selector: 'dsp-select-resource-class',
    templateUrl: './select-resource-class.component.html',
    styleUrls: ['./select-resource-class.component.scss']
})
export class SelectResourceClassComponent implements OnInit, OnChanges, OnDestroy {

    @Input() formGroup: FormGroup;

    @Input() resourceClassDefinitions: ResourceClassDefinition[];

    @Output() resourceClassSelected = new EventEmitter<string>();

    get selectedResourceClassIri(): string | false {
        if (this._selectedResourceClassIri !== undefined && this._selectedResourceClassIri !== null) {
            return this._selectedResourceClassIri;
        } else {
            return false;
        }
    }

    // stores the currently selected resource class
    private _selectedResourceClassIri: string;

    ontologyChangesSubscription: Subscription;

    form: FormGroup;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    /**
     * Initialises the FormGroup for the resource class selection.
     * The initial value is set to null.
     */
    private initForm() {
        // build a form for the resource class selection
        this.form = this.fb.group({
            resourceClass: [null] // resource class selection is optional
        });

        // reset on updates of @Input resourceClassDefinitions
        this._selectedResourceClassIri = undefined;

        this.closeOntologyChangesSubscription();

        // store and emit Iri of the resource class when selected
        this.ontologyChangesSubscription = this.form.valueChanges.subscribe((data) => {
            this._selectedResourceClassIri = data.resourceClass;
            this.resourceClassSelected.emit(this._selectedResourceClassIri);
        });
    }

    /**
     * Unsubscribe from form changes.
     */
    private closeOntologyChangesSubscription() {
        if (this.ontologyChangesSubscription !== undefined) {
            this.ontologyChangesSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.initForm();

        // add form to the parent form group
        this.formGroup.addControl('resourceClass', this.form);
    }

    ngOnChanges(changes: SimpleChanges) {

        if (this.form !== undefined) {

            // resource classes have been reinitialized
            // reset form
            resolvedPromise.then(() => {

                // remove this form from the parent form group
                this.formGroup.removeControl('resourceClass');

                this.initForm();

                // add form to the parent form group
                this.formGroup.addControl('resourceClass', this.form);

            });

        }
    }

    ngOnDestroy() {
        this.closeOntologyChangesSubscription();
    }

}
