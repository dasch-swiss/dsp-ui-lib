import { Component, Inject, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DspApiConnectionToken } from '../../core';
import {
    ApiResponseError,
    ClassDefinition,
    KnoraApiConnection,
    OntologiesMetadata, PropertyDefinition,
    ResourceClassDefinition, ResourcePropertyDefinition
} from '@dasch-swiss/dsp-js';
import { Properties, SelectPropertyComponent } from './select-property/select-property.component';
import { SelectResourceClassComponent } from './select-resource-class/select-resource-class.component';
import { Subscription } from 'rxjs';
import { PropertyWithValue } from './select-property/specify-property-value/operator';

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
export class AdvancedSearchComponent implements OnInit, OnDestroy {

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

    formChangesSubscription: Subscription;

    // reference to the component that controls the resource class selection
    @ViewChild('resourceClass') resourceClassComponent: SelectResourceClassComponent;

    // reference to the component controlling the property selection
    @ViewChildren('property') propertyComponents: QueryList<SelectPropertyComponent>;

    constructor(
        @Inject(FormBuilder) private fb: FormBuilder,
        @Inject(DspApiConnectionToken) private knoraApiConnection: KnoraApiConnection) {
    }

    ngOnInit() {

        // parent form is empty, it gets passed to the child components
        this.form = this.fb.group({});

        // if form status changes, re-run validation
        this.formChangesSubscription = this.form.statusChanges.subscribe((data) => {
            this.formValid = this._validateForm();
            // console.log(this.form);
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
    private _makeResourceClassesArray(classDefs: { [index: string]: ClassDefinition}): ResourceClassDefinition[] {

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

                this.resourceClasses = this._makeResourceClassesArray(onto.get(ontologyIri).classes);

                this.properties = this.makeResourceProperties(onto.get(ontologyIri).properties);
            },
            err => {
                console.error(err);
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

            this.knoraApiConnection.v2.ontologyCache.getResourceClassDefinition(resourceClassIri).subscribe(
                onto => {
                    this.activeResourceClass = onto.classes[resourceClassIri];

                    this.properties = this.makeResourceProperties(onto.properties);

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
        // TODO: create Gravsearch query using a service, and submit query.

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

        console.log(properties, resClass);
    }

}
