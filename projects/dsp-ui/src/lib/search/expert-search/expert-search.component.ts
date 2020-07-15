import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KnoraApiConfig } from '@dasch-swiss/dsp-js';
import { DspApiConfigToken } from '../../core/core.module';
import { AdvancedSearchParams, AdvancedSearchParamsService } from '../services/advanced-search-params.service';

@Component({
    selector: 'dsp-expert-search',
    templateUrl: './expert-search.component.html',
    styleUrls: ['./expert-search.component.scss']
})
export class ExpertSearchComponent implements OnInit {

    /**
     * @param gravsearchQuery Send the gravsearch query back.
     */
    @Output() gravsearchQuery = new EventEmitter<string>();

    /**
     * @param toggleExpertSearchForm Trigger toggle for extended search form.
     */
    @Output() toggleExpertSearchForm = new EventEmitter<boolean>();

    expertSearchForm: FormGroup;

    constructor(
        @Inject(DspApiConfigToken) private dspApiConfig: KnoraApiConfig,
        private _searchParamsService: AdvancedSearchParamsService,
        private fb: FormBuilder,
        private _route: ActivatedRoute,
        private _router: Router
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    /**
     * @ignore
     * Initiate the form with predefined Gravsearch query as example.
     */
    private initForm() {
        this.expertSearchForm = this.fb.group({
            gravquery: [
`PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
PREFIX incunabula: <${this.dspApiConfig.apiUrl}/ontology/0803/incunabula/simple/v2#>

CONSTRUCT {
    ?book knora-api:isMainResource true .
    ?book incunabula:title ?title .

} WHERE {
    ?book a incunabula:book .
    ?book incunabula:title ?title .
}
`,
                Validators.required
            ]
        });
    }

    /**
     * @ignore
     * Reset the form to the initial state.
     */
    resetForm() {
        this.initForm();
    }

    /**
     * @ignore
     * Send the gravsearch query to the result view, either through the route or by emitting the gravsearch as an output.
     */
    submitQuery() {
        const gravsearch = this.generateGravsearch(0);

        if (gravsearch) {
            console.log('submitQuery gravsearch', gravsearch);
            this.gravsearchQuery.emit(gravsearch);
        }

        // toggle expert search form
        this.toggleExpertSearchForm.emit(true);
    }

    /**
     * @ignore
     * Generate the whole gravsearch query matching the query given by the form.
     */
    private generateGravsearch(offset: number = 0): string {
        const queryTemplate = this.expertSearchForm.controls['gravquery'].value;

        // offset component of the Gravsearch query
        const offsetTemplate = `
         OFFSET ${offset}
         `;

        // function that generates the same Gravsearch query with the given offset
        const generateGravsearchWithCustomOffset = (
            localOffset: number
        ): string => {
            const offsetCustomTemplate = `
             OFFSET ${localOffset}
             `;

            return queryTemplate + offsetCustomTemplate;
        };

        if (offset === 0) {
            // store the function so another Gravsearch query can be created with an increased offset
            this._searchParamsService.changeSearchParamsMsg(new AdvancedSearchParams(generateGravsearchWithCustomOffset));
        }
        return queryTemplate + offsetTemplate;
    }

}
