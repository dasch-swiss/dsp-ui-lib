import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOntologyComponent } from './select-ontology.component';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { OntologiesMetadata, OntologyMetadata } from '@dasch-swiss/dsp-js';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <dsp-select-ontology #selectOnto [formGroup]="form" [ontologiesMetadata]="ontoMetadata"
                             (ontologySelected)="ontoSelected($event)"></dsp-select-ontology>`
})
class TestHostComponent implements OnInit {

    @ViewChild('selectOnto') selectOntology: SelectOntologyComponent;

    ontoMetadata: OntologiesMetadata;

    form: FormGroup;

    selectedOntoIri: string;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

        // TODO: replace with MockOntology.mockOntologiesMetadata
        this.ontoMetadata = new OntologiesMetadata();

        const anythingOnto = new OntologyMetadata();
        anythingOnto.id = 'anyid';
        anythingOnto.label = 'anythingOnto';

        const somethingOnto = new OntologyMetadata();
        somethingOnto.id = 'someid';
        somethingOnto.label = 'somethingOnto';

        this.ontoMetadata.ontologies = [anythingOnto, somethingOnto];
    }

    ontoSelected(ontoIri: string) {
        this.selectedOntoIri = ontoIri;
    }
}

describe('SelectOntologyComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    let loader: HarnessLoader;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                ReactiveFormsModule,
                MatSelectModule,
                MatOptionModule
            ],
            declarations: [
                SelectOntologyComponent,
                TestHostComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(testHostFixture);

        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostComponent.selectOntology).toBeTruthy();
    });

    it('should add a new control to the parent form', () => {

        expect(testHostComponent.form.contains('ontologies')).toBe(true);

    });

    it('should initialise the ontologies\' metadata', () => {

        expect(testHostComponent.selectOntology.ontologiesMetadata.ontologies).toBeDefined();
        expect(testHostComponent.selectOntology.ontologiesMetadata.ontologies.length).toEqual(2);

    });

    it('should init the MatSelect and MatOptions correctly', async () => {

        const select = await loader.getHarness(MatSelectHarness);
        const initVal = await select.getValueText();

        // placeholder
        expect(initVal).toEqual('Select an Ontology');

        await select.open();

        const options = await select.getOptions();

        expect(options.length).toEqual(2);

        const option1 = await options[0].getText();

        expect(option1).toEqual('anythingOnto');

        const option2 = await options[1].getText();

        expect(option2).toEqual('somethingOnto');

    });

    it('should emit the Iri of a selected ontology', async () => {

        expect(testHostComponent.selectedOntoIri).toBeUndefined();

        const select = await loader.getHarness(MatSelectHarness);

        await select.open();

        const options = await select.getOptions({text: 'anythingOnto'});

        expect(options.length).toEqual(1);

        await options[0].click();

        expect(testHostComponent.selectedOntoIri).toEqual('anyid');

    });

    it('should unsubscribe from from changes on destruction', () => {

        expect(testHostComponent.selectOntology.ontologyChangesSubscription.closed).toBe(false);

        testHostFixture.destroy();

        expect(testHostComponent.selectOntology.ontologyChangesSubscription.closed).toBe(true);

    });
});
