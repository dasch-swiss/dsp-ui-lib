import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSearchComponent } from './advanced-search.component';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DspApiConnectionToken } from '../../core';
import {
    MockOntology,
    OntologiesEndpointV2,
    OntologiesMetadata,
    OntologyMetadata,
    ReadOntology,
    ResourceClassDefinition
} from '@dasch-swiss/dsp-js';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { OntologyCache } from '@dasch-swiss/dsp-js/src/cache/ontology-cache/OntologyCache';

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
 * Test component to simulate select ontology component.
 */
@Component({
    selector: 'dsp-select-resource-class',
    template: ``
})
class TestSelectResourceClassComponent implements OnInit {

    @Input() formGroup: FormGroup;

    @Input() resourceClassDefinitions: ResourceClassDefinition[];

    @Output() resourceClassSelected = new EventEmitter<string>();

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
                onto: jasmine.createSpyObj('onto', ['getOntologiesMetadata']),
                ontologyCache: jasmine.createSpyObj('ontologyCache', ['getOntology'])
            }
        };

        TestBed.configureTestingModule({
            declarations: [AdvancedSearchComponent, TestHostComponent, TestSelectOntologyComponent, TestSelectResourceClassComponent],
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

    it('should react when an ontology is selected', async () => {

        const dspConnSpy = TestBed.inject(DspApiConnectionToken);

        (dspConnSpy.v2.ontologyCache as jasmine.SpyObj<OntologyCache>).getOntology.and.callFake(
            (ontoIri: string) => {

                const anythingOnto = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2');
                const knoraApiOnto = MockOntology.mockReadOntology('http://api.knora.org/ontology/knora-api/v2');

                const ontoMap: Map<string, ReadOntology> = new Map();

                ontoMap.set('http://api.knora.org/ontology/knora-api/v2', knoraApiOnto);
                ontoMap.set('http://0.0.0.0:3333/ontology/0001/anything/v2', anythingOnto);

                return of(ontoMap);
            }
        );

        const hostCompDe = testHostFixture.debugElement;
        const selectOntoComp = hostCompDe.query(By.directive(TestSelectOntologyComponent));

        (selectOntoComp.componentInstance as TestSelectOntologyComponent).ontologySelected.emit('http://0.0.0.0:3333/ontology/0001/anything/v2');

        testHostFixture.detectChanges();

        expect(testHostComponent.advancedSearch.activeOntology).toEqual('http://0.0.0.0:3333/ontology/0001/anything/v2');
        expect(testHostComponent.advancedSearch.activeResourceClass).toEqual(undefined);
        expect(testHostComponent.advancedSearch.resourceClasses.length).toEqual(8);
        expect(Object.keys(testHostComponent.advancedSearch.properties).length).toEqual(28);

        const selectResClassComp = hostCompDe.query(By.directive(TestSelectResourceClassComponent));

        expect((selectResClassComp.componentInstance as TestSelectResourceClassComponent).resourceClassDefinitions.length).toEqual(8);

        expect(dspConnSpy.v2.ontologyCache.getOntology).toHaveBeenCalledTimes(1);
        expect(dspConnSpy.v2.ontologyCache.getOntology).toHaveBeenCalledWith('http://0.0.0.0:3333/ontology/0001/anything/v2');

    });
});
