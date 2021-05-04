import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    ClassDefinition,
    MockOntology,
    OntologiesEndpointV2,
    OntologiesMetadata,
    OntologyMetadata, PropertyDefinition,
    ReadOntology,
    ResourceClassDefinition, ResourcePropertyDefinition
} from '@dasch-swiss/dsp-js';
import { OntologyCache } from '@dasch-swiss/dsp-js/src/cache/ontology-cache/OntologyCache';
import { of } from 'rxjs';
import { DspApiConnectionToken } from '../../core/core.module';
import { AdvancedSearchComponent } from './advanced-search.component';

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
 * Test component to simulate select resource class and property component.
 */
@Component({
    selector: 'dsp-resource-and-property-selection',
    template: ``
})
class TestSelectResourceClassAndPropertyComponent {

    @Input() formGroup: FormGroup;

    @Input() activeOntology: string;

    @Input() resClassRestriction?: string;

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

    let loader: HarnessLoader;

    beforeEach(waitForAsync(() => {

        const dspConnSpy = {
            v2: {
                onto: jasmine.createSpyObj('onto', ['getOntologiesMetadata']),
                ontologyCache: jasmine.createSpyObj('ontologyCache', ['getOntology', 'getResourceClassDefinition'])
            }
        };

        TestBed.configureTestingModule({
            declarations: [
                AdvancedSearchComponent,
                TestHostComponent,
                TestSelectOntologyComponent,
                TestSelectResourceClassAndPropertyComponent
            ],
            imports: [
                ReactiveFormsModule,
                BrowserAnimationsModule,
                MatIconModule,
                MatSnackBarModule
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

    describe('Ontology with resources', () => {
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

            loader = TestbedHarnessEnvironment.loader(testHostFixture);

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

        it('should set the active ontology when an ontology is selected',  () => {

            const hostCompDe = testHostFixture.debugElement;
            const selectOntoComp = hostCompDe.query(By.directive(TestSelectOntologyComponent));

            (selectOntoComp.componentInstance as TestSelectOntologyComponent).ontologySelected.emit('http://0.0.0.0:3333/ontology/0001/anything/v2');

            testHostFixture.detectChanges();

            expect(testHostComponent.advancedSearch.activeOntology).toEqual('http://0.0.0.0:3333/ontology/0001/anything/v2');

            expect(testHostComponent.advancedSearch.resourceAndPropertySelection.activeOntology).toEqual('http://0.0.0.0:3333/ontology/0001/anything/v2');

        });

        /*it('should disable add property button on init', async () => {

            const addPropButton = await loader.getHarness(MatButtonHarness.with({selector: '.add-property-button'}));

            expect(await addPropButton.isDisabled()).toBe(true);
        });

        it('should disable remove property button on init', async () => {

            const rmPropButton = await loader.getHarness(MatButtonHarness.with({selector: '.remove-property-button'}));

            expect(await rmPropButton.isDisabled()).toBe(true);

        });*/

        it('should react when an ontology is selected', async () => {

            const hostCompDe = testHostFixture.debugElement;
            const selectOntoComp = hostCompDe.query(By.directive(TestSelectOntologyComponent));

            (selectOntoComp.componentInstance as TestSelectOntologyComponent).ontologySelected.emit('http://0.0.0.0:3333/ontology/0001/anything/v2');

            testHostFixture.detectChanges();

            expect(testHostComponent.advancedSearch.activeOntology).toEqual('http://0.0.0.0:3333/ontology/0001/anything/v2');

        });

        /*it('should display a property selection when the add property button has been clicked', async () => {

            // simulate state after anything onto selection
            testHostComponent.advancedSearch.activeOntology = 'http://0.0.0.0:3333/ontology/0001/anything/v2';

            const anythingOnto = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2');

            // get resource class defs
            testHostComponent.advancedSearch.resourceClasses = anythingOnto.getClassDefinitionsByType(ResourceClassDefinition);

            const resProps = anythingOnto.getPropertyDefinitionsByType(ResourcePropertyDefinition);

            testHostComponent.advancedSearch.properties = resProps;

            testHostFixture.detectChanges();

            expect(testHostComponent.advancedSearch.activeProperties.length).toEqual(0);

            const addPropButton = await loader.getHarness(MatButtonHarness.with({selector: '.add-property-button'}));

            expect(await addPropButton.isDisabled()).toBe(false);

            await addPropButton.click();

            expect(testHostComponent.advancedSearch.activeProperties.length).toEqual(1);

            const hostCompDe = testHostFixture.debugElement;
            const selectPropComp = hostCompDe.query(By.directive(TestSelectPropertyComponent));

            expect((selectPropComp.componentInstance as TestSelectPropertyComponent).activeResourceClass).toEqual(undefined);
            expect((selectPropComp.componentInstance as TestSelectPropertyComponent).index).toEqual(0);
            expect((selectPropComp.componentInstance as TestSelectPropertyComponent).properties).toEqual(resProps);

            const rmPropButton = await loader.getHarness(MatButtonHarness.with({selector: '.remove-property-button'}));

            expect(await rmPropButton.isDisabled()).toBe(false );
        });

        it('should add to and remove from active properties array when property buttons are clicked', async () => {

            // simulate state after anything onto selection
            testHostComponent.advancedSearch.activeOntology = 'http://0.0.0.0:3333/ontology/0001/anything/v2';

            const anythingOnto = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2');

            // get resource class defs
            testHostComponent.advancedSearch.resourceClasses = anythingOnto.getClassDefinitionsByType(ResourceClassDefinition);

            const resProps = anythingOnto.getPropertyDefinitionsByType(ResourcePropertyDefinition);

            testHostComponent.advancedSearch.properties = resProps;

            testHostFixture.detectChanges();

            const addPropButton = await loader.getHarness(MatButtonHarness.with({selector: '.add-property-button'}));

            const rmPropButton = await loader.getHarness(MatButtonHarness.with({selector: '.remove-property-button'}));

            expect(testHostComponent.advancedSearch.activeProperties.length).toEqual(0);

            await addPropButton.click();

            expect(testHostComponent.advancedSearch.activeProperties.length).toEqual(1);

            await addPropButton.click();

            expect(testHostComponent.advancedSearch.activeProperties.length).toEqual(2);

            await rmPropButton.click();

            expect(testHostComponent.advancedSearch.activeProperties.length).toEqual(1);

            await rmPropButton.click();

            expect(testHostComponent.advancedSearch.activeProperties.length).toEqual(0);
        });

        it('should add at max four property selections', async () => {

            // simulate state after anything onto selection
            testHostComponent.advancedSearch.activeOntology = 'http://0.0.0.0:3333/ontology/0001/anything/v2';

            const anythingOnto = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2');

            // get resource class defs
            testHostComponent.advancedSearch.resourceClasses = anythingOnto.getClassDefinitionsByType(ResourceClassDefinition);

            const resProps = anythingOnto.getPropertyDefinitionsByType(ResourcePropertyDefinition);

            testHostComponent.advancedSearch.properties = resProps;

            testHostComponent.advancedSearch.activeProperties = [true, true, true, true];

            testHostFixture.detectChanges();

            const addPropButton = await loader.getHarness(MatButtonHarness.with({selector: '.add-property-button'}));

            expect(await addPropButton.isDisabled()).toEqual(true);

        });*/
    });

});
