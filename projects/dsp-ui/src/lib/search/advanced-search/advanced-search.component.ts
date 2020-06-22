import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DspApiConnectionToken } from '../../core';
import {
    ApiResponseError,
    ClassDefinition,
    KnoraApiConnection,
    OntologiesMetadata, PropertyDefinition,
    ResourceClassDefinition, ResourcePropertyDefinition
} from '@dasch-swiss/dsp-js';
import { Properties } from './select-property/select-property.component';

// https://dev.to/krumpet/generic-type-guard-in-typescript-258l
type Constructor<T> = { new(...args: any[]): T };

const typeGuard = <T>(o: any, className: Constructor<T>): o is T => {
    return o instanceof className;
};

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

    activeOntology: string;

    activeResourceClass: ResourceClassDefinition;

    resourceClasses: ResourceClassDefinition[];

    activeProperties: boolean[] = [];

    properties: Properties;

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

    /**
     * Given a map of class definitions,
     * returns an array of resource class definitions.
     *
     * @param classDefs a map of class definitions
     */
    private makeResourceClassesArray(classDefs: { [index: string]: ClassDefinition}): ResourceClassDefinition[] {

        const classIris = Object.keys(classDefs);

        // get resource class defs
        return classIris.filter(resClassIri => {
            return typeGuard(classDefs[resClassIri], ResourceClassDefinition);
        }).map(
            (resClassIri: string) => {
                return classDefs[resClassIri] as ResourceClassDefinition;
            }
        );

    }

    /**
     * Given a map of property definitions,
     * returns a map of resource property definitions.
     *
     * @param propertyDefs a map of property definitions
     */
    private makeResourceProperties(propertyDefs: { [index: string]: PropertyDefinition}): Properties {
        const resProps: Properties = {};

        const propIris = Object.keys(propertyDefs);

        propIris.filter(
            (propIri: string) => {
                return typeGuard(propertyDefs[propIri], ResourcePropertyDefinition);
            }
        ).forEach((propIri: string) => {
            resProps[propIri] = (propertyDefs[propIri] as ResourcePropertyDefinition);
        });

        return resProps;
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

        this.knoraApiConnection.v2.ontologyCache.getOntology(ontologyIri).subscribe(
            onto => {

                this.resourceClasses = this.makeResourceClassesArray(onto.get(ontologyIri).classes);

                this.properties = this.makeResourceProperties(onto.get(ontologyIri).properties);
            },
            err => {
                console.error(err);
            }
        );
    }

    getPropertiesForResourceClass(resClassIri: string) {
        console.log(resClassIri);
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
