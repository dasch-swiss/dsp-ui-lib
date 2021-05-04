import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AdvancedSearchParamsService, DspApiConnectionToken } from '@dasch-swiss/dsp-ui';
import { ApiResponseData, ApiResponseError, KnoraApiConnection, LogoutResponse } from '@dasch-swiss/dsp-js';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PropertyWithValue } from '../../../projects/dsp-ui/src/lib/search';
import { ResourceAndPropertySelectionComponent } from '../resource-and-property-selection-component/resource-and-property-selection.component';

@Component({
    selector: 'app-advanced-search-playground',
    templateUrl: './advanced-search-playground.component.html',
    styleUrls: ['./advanced-search-playground.component.scss']
})
export class AdvancedSearchPlaygroundComponent implements OnInit {

    loading: boolean;

    form: FormGroup;

    activeOntology = 'http://0.0.0.0:3333/ontology/0001/anything/v2';

    // reference to the component that controls the resource class selection
    @ViewChild('resAndPropSel') resourceAndPropertySelection: ResourceAndPropertySelectionComponent;

    constructor(
        @Inject(FormBuilder) private _fb: FormBuilder,
        private _advancedSearchParamsService: AdvancedSearchParamsService,
        @Inject(DspApiConnectionToken) private _dspApiConnection: KnoraApiConnection) {
    }

    ngOnInit(): void {
        this.loading = true;

        this.form = this._fb.group({});

        this._dspApiConnection.v2.auth.logout().subscribe(
            (response: ApiResponseData<LogoutResponse>) => {
                this.loading = false;
            },
            (error: ApiResponseError) => {
                console.error(error);
            });

    }

    submit() {

        const resClassOption = this.resourceAndPropertySelection.resourceClassComponent.selectedResourceClassIri;

        let resClass;

        if (resClassOption !== false) {
            resClass = resClassOption;
        }

        const properties: PropertyWithValue[] = this.resourceAndPropertySelection.propertyComponents.map(
            (propComp) => {
                return propComp.getPropertySelectedWithValue();
            }
        );

        console.log(resClassOption, properties);
    }

}
