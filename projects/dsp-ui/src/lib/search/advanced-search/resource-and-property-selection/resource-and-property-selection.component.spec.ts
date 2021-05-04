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
import { MatButtonHarness } from '@angular/material/button/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

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
class TestSelectPropertyComponent {

    // parent FormGroup
    @Input() formGroup: FormGroup;

    // index of the given property (unique)
    @Input() index: number;

    // properties that can be selected from
    @Input() properties: ResourcePropertyDefinition[];

    @Input() activeResourceClass: ResourceClassDefinition;

}

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <dsp-resource-and-property-selection #resClassAndProp [formGroup]="form"
                                             [activeOntology]="'http://0.0.0.0:3333/ontology/0001/anything/v2'"></dsp-resource-and-property-selection>`
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
                TestSelectPropertyComponent
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

        loader = TestbedHarnessEnvironment.loader(testHostFixture);

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

    it('should react when a resource class is selected', async () => {

        const dspConnSpy = TestBed.inject(DspApiConnectionToken);

        (dspConnSpy.v2.ontologyCache as jasmine.SpyObj<OntologyCache>).getResourceClassDefinition.and.callFake(
            (resClassIri: string) => {
                return of(MockOntology.mockIResourceClassAndPropertyDefinitions('http://0.0.0.0:3333/ontology/0001/anything/v2#Thing'));
            }
        );

        const anythingOnto = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2');

        // get resource class defs
        testHostComponent.resourceClassAndPropertySelection.resourceClasses = anythingOnto.getClassDefinitionsByType(ResourceClassDefinition);

        const resProps = anythingOnto.getPropertyDefinitionsByType(ResourcePropertyDefinition);

        testHostComponent.resourceClassAndPropertySelection.properties = resProps;

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;
        const selectResClassComp = hostCompDe.query(By.directive(TestSelectResourceClassComponent));

        (selectResClassComp.componentInstance as TestSelectResourceClassComponent).resourceClassSelected.emit('http://0.0.0.0:3333/ontology/0001/anything/v2#Thing');

        testHostFixture.detectChanges();

        expect(testHostComponent.resourceClassAndPropertySelection.activeResourceClass)
            .toEqual(MockOntology.mockIResourceClassAndPropertyDefinitions('http://0.0.0.0:3333/ontology/0001/anything/v2#Thing').classes['http://0.0.0.0:3333/ontology/0001/anything/v2#Thing']);
        expect(Object.keys(testHostComponent.resourceClassAndPropertySelection.properties).length).toEqual(25);

        expect(dspConnSpy.v2.ontologyCache.getResourceClassDefinition).toHaveBeenCalledTimes(1);
        expect(dspConnSpy.v2.ontologyCache.getResourceClassDefinition).toHaveBeenCalledWith('http://0.0.0.0:3333/ontology/0001/anything/v2#Thing');

        const addPropButton = await loader.getHarness(MatButtonHarness.with({selector: '.add-property-button'}));

        await addPropButton.click();

        const selectPropComp = hostCompDe.query(By.directive(TestSelectPropertyComponent));

        expect((selectPropComp.componentInstance as TestSelectPropertyComponent).activeResourceClass)
            .toEqual(MockOntology.mockIResourceClassAndPropertyDefinitions('http://0.0.0.0:3333/ontology/0001/anything/v2#Thing')
                .classes['http://0.0.0.0:3333/ontology/0001/anything/v2#Thing']);

        expect((selectPropComp.componentInstance as TestSelectPropertyComponent).index).toEqual(0);
        expect(Object.keys((selectPropComp.componentInstance as TestSelectPropertyComponent).properties).length).toEqual(25);

    });

    it('should disable add property button on init', async () => {

        const addPropButton = await loader.getHarness(MatButtonHarness.with({selector: '.add-property-button'}));

        expect(await addPropButton.isDisabled()).toBe(false);
    });

    it('should disable remove property button on init', async () => {

        const rmPropButton = await loader.getHarness(MatButtonHarness.with({selector: '.remove-property-button'}));

        expect(await rmPropButton.isDisabled()).toBe(true);

    });

    it('should display a property selection when the add property button has been clicked', async () => {

        const anythingOnto = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2');

        // get resource class defs
        testHostComponent.resourceClassAndPropertySelection.resourceClasses = anythingOnto.getClassDefinitionsByType(ResourceClassDefinition);

        const resProps = anythingOnto.getPropertyDefinitionsByType(ResourcePropertyDefinition);

        testHostComponent.resourceClassAndPropertySelection.properties = resProps;

        testHostFixture.detectChanges();

        expect(testHostComponent.resourceClassAndPropertySelection.activeProperties.length).toEqual(0);

        const addPropButton = await loader.getHarness(MatButtonHarness.with({selector: '.add-property-button'}));

        expect(await addPropButton.isDisabled()).toBe(false);

        await addPropButton.click();

        expect(testHostComponent.resourceClassAndPropertySelection.activeProperties.length).toEqual(1);

        const hostCompDe = testHostFixture.debugElement;
        const selectPropComp = hostCompDe.query(By.directive(TestSelectPropertyComponent));

        expect((selectPropComp.componentInstance as TestSelectPropertyComponent).activeResourceClass).toEqual(undefined);
        expect((selectPropComp.componentInstance as TestSelectPropertyComponent).index).toEqual(0);
        expect((selectPropComp.componentInstance as TestSelectPropertyComponent).properties).toEqual(resProps);

        const rmPropButton = await loader.getHarness(MatButtonHarness.with({selector: '.remove-property-button'}));

        expect(await rmPropButton.isDisabled()).toBe(false );
    });

});
