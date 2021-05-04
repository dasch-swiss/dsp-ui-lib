import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceAndPropertySelectionComponent } from './resource-and-property-selection.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DspApiConnectionToken } from '../../../core';
import { OntologyCache } from '@dasch-swiss/dsp-js/src/cache/ontology-cache/OntologyCache';
import { MockOntology, ReadOntology, ResourceClassDefinition, ResourcePropertyDefinition } from '@dasch-swiss/dsp-js';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';

/**
 * Test host component to simulate select resource class component.
 */
@Component({
    selector: '<dsp-select-resource-class></dsp-select-resource-class>',
    template: ``
})
class TestSelectResourceClassComponent {

    @Input() formGroup: FormGroup;

    @Input() resourceClassDefinitions: ResourceClassDefinition[];

    @Output() resourceClassSelected = new EventEmitter<string | null>();

}

/**
 * Test host component to simulate select property component.
 */
@Component({
    selector: '<dsp-select-property></dsp-select-property>',
    template: ``
})
class TestSelectPropertyClassComponent {

    // parent FormGroup
    @Input() formGroup: FormGroup;

    // index of the given property (unique)
    @Input() index: number;

    // properties that can be selected from
    @Input() properties: ResourcePropertyDefinition[];

}

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <dsp-resource-and-property-selection #resClassAndProp [formGroup]="form" [activeOntology]="'http://0.0.0.0:3333/ontology/0001/anything/v2'"></dsp-resource-and-property-selection>`
})
class TestHostComponent implements OnInit {

    @ViewChild('resClassAndProp') resourceClassAndPropertySelection: ResourceAndPropertySelectionComponent;

    form: FormGroup;

    activeOntology = 'http://0.0.0.0:3333/ontology/0001/anything/v2';

    constructor(@Inject(FormBuilder) private _fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this._fb.group({});
    }

}

describe('ResourceAndPropertySelectionComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    let loader: HarnessLoader;

    beforeEach(async () => {

        const dspConnSpy = {
            v2: {
                ontologyCache: jasmine.createSpyObj('ontologyCache', ['getOntology', 'getResourceClassDefinition'])
            }
        };

        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                MatIconModule
            ],
            declarations: [
                ResourceAndPropertySelectionComponent,
                TestHostComponent,
                TestSelectResourceClassComponent,
                TestSelectPropertyClassComponent
            ],
            providers: [
                {
                    provide: DspApiConnectionToken,
                    useValue: dspConnSpy
                }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {

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

        testHostFixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should request the active ontology', () => {

        const dspConnSpy = TestBed.inject(DspApiConnectionToken);

        const hostCompDe = testHostFixture.debugElement;

        expect(testHostComponent.resourceClassAndPropertySelection.activeOntology).toEqual('http://0.0.0.0:3333/ontology/0001/anything/v2');

        expect(testHostComponent.resourceClassAndPropertySelection.activeResourceClass).toEqual(undefined);
        expect(testHostComponent.resourceClassAndPropertySelection.resourceClasses.length).toEqual(8);
        expect(Object.keys(testHostComponent.resourceClassAndPropertySelection.properties).length).toEqual(28);

        const selectResClassComp = hostCompDe.query(By.directive(TestSelectResourceClassComponent));
        expect((selectResClassComp.componentInstance as TestSelectResourceClassComponent).resourceClassDefinitions.length).toEqual(8);

        expect(dspConnSpy.v2.ontologyCache.getOntology).toHaveBeenCalledTimes(1);
        expect(dspConnSpy.v2.ontologyCache.getOntology).toHaveBeenCalledWith('http://0.0.0.0:3333/ontology/0001/anything/v2');


    });
});
