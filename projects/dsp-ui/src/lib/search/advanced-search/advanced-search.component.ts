import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DspApiConnectionToken } from '../../core';
import { ApiResponseError, KnoraApiConnection, OntologiesMetadata } from '@dasch-swiss/dsp-js';

@Component({
    selector: 'dsp-advanced-search',
    templateUrl: './advanced-search.component.html',
    styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {

    ontologiesMetadata: OntologiesMetadata;

    // FormGroup (used as parent for child components)
    form: FormGroup;

    // form validation status
    formValid = false;

    constructor(
        @Inject(FormBuilder) private fb: FormBuilder,
        @Inject(DspApiConnectionToken) private knoraApiConnection: KnoraApiConnection) {
    }

    /**
     * @ignore
     * Gets all available ontologies for the search form.
     * @returns void
     */
    initializeOntologies(): void {

        this.knoraApiConnection.v2.onto.getOntologiesMetadata().subscribe(
            (response: OntologiesMetadata) => {
                this.ontologiesMetadata = response;
            },
            (error: ApiResponseError) => {
                console.error(error);
            });
    }

    getResourceClassesAndPropertiesForOntology(ontologyIri: string) {

    }

    /**
     * @ignore
     * Validates form and returns its status (boolean).
     */
    private validateForm(): boolean {

        // check that either a resource class is selected or at least one property is specified
        return this.form.valid /*&&
            (this.propertyComponents.length > 0 || (this.resourceClassComponent !== undefined && this.resourceClassComponent.getResourceClassSelected() !== false));*/

    }

    submit() {}


    ngOnInit() {

        // parent form is empty, it gets passed to the child components
        this.form = this.fb.group({});

        // if form status changes, re-run validation
        this.form.statusChanges.subscribe((data) => {
            this.formValid = this.validateForm();
            // console.log(this.form);
        });

        // initialize ontologies to be used for the ontologies selection in the search form
        this.initializeOntologies();
    }

}
