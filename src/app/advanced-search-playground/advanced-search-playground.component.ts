import { Component, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AdvancedSearchParamsService, DspApiConnectionToken, SearchParams } from '@dasch-swiss/dsp-ui';
import {
    ApiResponseData,
    ApiResponseError,
    KnoraApiConnection,
    LogoutResponse,
    ReadOntology,
    ResourceClassAndPropertyDefinitions,
    ResourceClassDefinition,
    ResourcePropertyDefinition
} from '@dasch-swiss/dsp-js';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PropertyWithValue } from '../../../projects/dsp-ui/src/lib/search';
import { SelectResourceClassComponent } from '../../../projects/dsp-ui/src/lib/search/advanced-search/select-resource-class/select-resource-class.component';
import { SelectPropertyComponent } from '../../../projects/dsp-ui/src/lib/search/advanced-search/select-property/select-property.component';

@Component({
    selector: 'app-advanced-search-playground',
    templateUrl: './advanced-search-playground.component.html',
    styleUrls: ['./advanced-search-playground.component.scss']
})
export class AdvancedSearchPlaygroundComponent implements OnInit {

    loading: boolean;

    form: FormGroup;

    activeOntology: string;

    activeResourceClass: ResourceClassDefinition;

    resourceClasses: ResourceClassDefinition[];

    activeProperties: boolean[] = [];

    properties: ResourcePropertyDefinition[];

    // reference to the component that controls the resource class selection
    @ViewChild('resourceClass') resourceClassComponent: SelectResourceClassComponent;

    // reference to the component controlling the property selection
    @ViewChildren('property') propertyComponents: QueryList<SelectPropertyComponent>;

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

        this.getResourceClassesAndPropertiesForOntology('http://0.0.0.0:3333/ontology/0001/anything/v2');
    }

    getResourceClassesAndPropertiesForOntology(ontologyIri: string) {

        // reset active resource class definition
        this.activeResourceClass = undefined;

        // reset specified properties
        this.activeProperties = [];

        this.activeOntology = ontologyIri;

        this._dspApiConnection.v2.ontologyCache.getOntology(ontologyIri).subscribe(
            (onto: Map<string, ReadOntology>) => {

                this.resourceClasses = onto.get(ontologyIri).getClassDefinitionsByType(ResourceClassDefinition);

                this.properties = onto.get(ontologyIri).getPropertyDefinitionsByType(ResourcePropertyDefinition);
            },
            error => {
                console.error(error);
            }
        );
    }

    getPropertiesForResourceClass(resourceClassIri: string | null) {

        // reset specified properties
        this.activeProperties = [];

        // if the client undoes the selection of a resource class, use the active ontology as a fallback
        if (resourceClassIri === null) {
            this.getResourceClassesAndPropertiesForOntology(this.activeOntology);
        } else {

            this._dspApiConnection.v2.ontologyCache.getResourceClassDefinition(resourceClassIri).subscribe(
                (onto: ResourceClassAndPropertyDefinitions) => {

                    this.activeResourceClass = onto.classes[resourceClassIri];

                    this.properties = onto.getPropertyDefinitionsByType(ResourcePropertyDefinition);

                }
            );
        }
    }

    /**
     * @ignore
     * Add a property to the search form.
     * @returns void
     */
    addProperty(): void {
        this.activeProperties.push(true);
    }

    /**
     * @ignore
     * Remove the last property from the search form.
     * @returns void
     */
    removeProperty(): void {
        this.activeProperties.splice(-1, 1);
    }

    submit() {

        const resClassOption = this.resourceClassComponent.selectedResourceClassIri;

        let resClass;

        if (resClassOption !== false) {
            resClass = resClassOption;
        }

        const properties: PropertyWithValue[] = this.propertyComponents.map(
            (propComp) => {
                return propComp.getPropertySelectedWithValue();
            }
        );

        console.log(resClassOption, properties);
    }

}
