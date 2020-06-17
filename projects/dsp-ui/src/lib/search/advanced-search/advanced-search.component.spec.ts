import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSearchComponent } from './advanced-search.component';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DspApiConnectionToken } from '../../core';
import { OntologiesEndpointV2, OntologiesMetadata, OntologyMetadata } from '@dasch-swiss/dsp-js';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

/**
 * Test component to simulate select ontology component.
 */
@Component({
    selector: 'dsp-select-ontology',
    template: ``
})
class TestSelectOntologyComponent implements OnInit {

    @Input() formGroup: FormGroup;

    @Input() ontologiesMetadata: OntologiesMetadata;

    @Output() ontologySelected = new EventEmitter<string>();

    ngOnInit() {

    }

}

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <dsp-advanced-search #advSearch></dsp-advanced-search>`
})
class TestHostComponent implements OnInit {

    @ViewChild('advSearch') advancedSearch: AdvancedSearchComponent;

    ngOnInit() {
    }

}

describe('AdvancedSearchComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {

        const dspConnSpy = {
            v2: {
                onto: jasmine.createSpyObj('onto', ['getOntologiesMetadata'])
            }
        };

        TestBed.configureTestingModule({
            declarations: [AdvancedSearchComponent, TestHostComponent, TestSelectOntologyComponent],
            imports: [
                ReactiveFormsModule,
                BrowserAnimationsModule
            ],
            providers: [
                {
                    provide: DspApiConnectionToken,
                    useValue: dspConnSpy
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {

        const dspConnSpy = TestBed.inject(DspApiConnectionToken);

        (dspConnSpy.v2.onto as jasmine.SpyObj<OntologiesEndpointV2>).getOntologiesMetadata.and.callFake(
            () => {

                const ontoMetadata = new OntologiesMetadata();

                const anythingOnto = new OntologyMetadata();
                anythingOnto.id = 'anyid';
                anythingOnto.label = 'anythingOnto';

                ontoMetadata.ontologies = [anythingOnto];

                return of(ontoMetadata);
            }
        );

        testHostFixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = testHostFixture.componentInstance;

        testHostFixture.detectChanges();
    });

    it('should create', () => {

        expect(testHostComponent).toBeTruthy();
        expect(testHostComponent.advancedSearch).toBeTruthy();

    });

    it('should get ontologies metadata on init', () => {

        const dspConnSpy = TestBed.inject(DspApiConnectionToken);

        expect(testHostComponent.advancedSearch.ontologiesMetadata).toBeDefined();
        expect(testHostComponent.advancedSearch.ontologiesMetadata.ontologies.length).toEqual(1);

        const hostCompDe = testHostFixture.debugElement;
        const selectOntoComp = hostCompDe.query(By.directive(TestSelectOntologyComponent));

        expect((selectOntoComp.componentInstance as TestSelectOntologyComponent).ontologiesMetadata).toBeDefined();
        expect((selectOntoComp.componentInstance as TestSelectOntologyComponent).ontologiesMetadata.ontologies.length).toEqual(1);

        expect(dspConnSpy.v2.onto.getOntologiesMetadata).toHaveBeenCalledTimes(1);

        expect((selectOntoComp.componentInstance as TestSelectOntologyComponent).formGroup).toBeDefined();

    });
});
