import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOntologyComponent } from './select-ontology.component';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { OntologiesMetadata, OntologyMetadata } from '@knora/api';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <dsp-select-ontology #selectOnto [formGroup]="form" [ontologiesMetadata]="ontoMetadata"
                             (ontologySelected)="ontoSelected($event)"></dsp-select-ontology>`
})
class TestHostDisplayValueComponent implements OnInit {

    @ViewChild('selectOnto') selectOntology: SelectOntologyComponent;

    ontoMetadata: OntologiesMetadata;

    form: FormGroup;

    selectedOntoIri: number;

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

    ontoSelected(ontoIri: number) {
        this.selectedOntoIri = ontoIri;
    }
}

describe('SelectOntologyComponent', () => {
    let testHostComponent: TestHostDisplayValueComponent;
    let testHostFixture: ComponentFixture<TestHostDisplayValueComponent>;

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
                TestHostDisplayValueComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostComponent.selectOntology).toBeTruthy();
    });
});
