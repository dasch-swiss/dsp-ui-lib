import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    ApiResponseError,
    Constants,
    KnoraApiConnection,
    OntologiesMetadata,
    ReadOntology,
    ResourceClassAndPropertyDefinitions,
    ResourceClassDefinition,
    ResourcePropertyDefinition
} from '@dasch-swiss/dsp-js';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../action/services/notification.service';
import { DspApiConnectionToken } from '../../core/core.module';
import { SearchParams } from '../../viewer/views/list-view/list-view.component';
import { GravsearchGenerationService } from '../services/gravsearch-generation.service';
import { SelectPropertyComponent } from './select-property/select-property.component';
import { PropertyWithValue } from './select-property/specify-property-value/operator';
import { SelectResourceClassComponent } from './select-resource-class/select-resource-class.component';

@Component({
    selector: 'dsp-advanced-search',
    templateUrl: './advanced-search.component.html',
    styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit, OnDestroy {

    /**
     * Filter ontologies by specified project IRI
     *
     * @param limitToProject
     */
    @Input() limitToProject?: string;

    /**
     * The data event emitter of type SearchParams
     *
     * @param  search
     */
    @Output() search = new EventEmitter<SearchParams>();

    ontologiesMetadata: OntologiesMetadata;

    // FormGroup (used as parent for child components)
    form: FormGroup;

    // form validation status
    formValid = false;

    activeOntology: string;

    activeResourceClass: ResourceClassDefinition;

    resourceClasses: ResourceClassDefinition[];

    activeProperties: boolean[] = [];

    properties: ResourcePropertyDefinition[];

    formChangesSubscription: Subscription;

    errorMessage: ApiResponseError;

    // reference to the component that controls the resource class selection
    @ViewChild('resourceClass') resourceClassComponent: SelectResourceClassComponent;

    // reference to the component controlling the property selection
    @ViewChildren('property') propertyComponents: QueryList<SelectPropertyComponent>;

    constructor(
        @Inject(FormBuilder) private _fb: FormBuilder,
        @Inject(DspApiConnectionToken) private _dspApiConnection: KnoraApiConnection,
        private _notification: NotificationService,
        private _gravsearchGenerationService: GravsearchGenerationService) {
    }

    ngOnInit() {

        // parent form is empty, it gets passed to the child components
        this.form = this._fb.group({});

        // if form status changes, re-run validation
        this.formChangesSubscription = this.form.statusChanges.subscribe((data) => {
            this.formValid = this._validateForm();
        });
        // initialize ontologies to be used for the ontologies selection in the search form
        this.initializeOntologies();
    }

    ngOnDestroy() {
        if (this.formChangesSubscription !== undefined) {
            this.formChangesSubscription.unsubscribe();
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

    /**
     * @ignore
     * Gets all available ontologies for the search form.
     * @returns void
     */
    initializeOntologies(): void {

        if (this.limitToProject) {
            this._dspApiConnection.v2.onto.getOntologiesByProjectIri(this.limitToProject).subscribe(
                (response: OntologiesMetadata) => {
                    // filter out system ontologies
                    response.ontologies = response.ontologies.filter(onto => onto.attachedToProject !== Constants.SystemProjectIRI);

                    this.ontologiesMetadata = response;
                },
                (error: ApiResponseError) => {
                    this._notification.openSnackBar(error);
                    this.errorMessage = error;
                });
        } else {
            this._dspApiConnection.v2.onto.getOntologiesMetadata().subscribe(
                (response: OntologiesMetadata) => {
                    // filter out system ontologies
                    response.ontologies = response.ontologies.filter(onto => onto.attachedToProject !== Constants.SystemProjectIRI);

                    this.ontologiesMetadata = response;
                },
                (error: ApiResponseError) => {
                    this._notification.openSnackBar(error);
                    this.errorMessage = error;
                });
        }


    }

    /**
     * Initialises resources classes and properties,
     * when an ontology is selected
     *
     * @param ontologyIri the Iri of the selected ontology.
     */
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
                this._notification.openSnackBar(error);
            }
        );
    }

    /**
     * @ignore
     * Once a resource class has been selected, gets its properties.
     * The properties will be made available to the user for selection.
     *
     * @param resourceClassIri the IRI of the selected resource class, if any.
     */
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
     * Validates form and returns its status (boolean).
     */
    private _validateForm(): boolean {

        // check that either a resource class is selected or at least one property is specified
        return this.form.valid &&
            (this.propertyComponents.length > 0 || (this.resourceClassComponent !== undefined && this.resourceClassComponent.selectedResourceClassIri !== false));

    }

    /**
     * @ignore
     * Resets the form (selected resource class and specified properties) preserving the active ontology.
     */
    resetForm() {
        if (this.activeOntology !== undefined) {
            this.getResourceClassesAndPropertiesForOntology(this.activeOntology);
        }
    }

    submit() {

        if (!this.formValid) {
            return; // check that form is valid
        }

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

        const gravsearch = this._gravsearchGenerationService.createGravsearchQuery(properties, resClass);

        if (gravsearch) {
            // emit query
            this.search.emit({
                query: gravsearch,
                mode: 'gravsearch'
            });
        }
    }

}
