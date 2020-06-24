import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Properties, SelectPropertyComponent } from './select-property.component';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import {
    Cardinality,
    MockOntology,
    PropertyDefinition,
    ResourceClassDefinition,
    ResourcePropertyDefinition
} from '@dasch-swiss/dsp-js';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';

// https://dev.to/krumpet/generic-type-guard-in-typescript-258l
type Constructor<T> = { new(...args: any[]): T };

const typeGuard = <T>(o: any, className: Constructor<T>): o is T => {
    return o instanceof className;
};

const makeProperties = (props: { [index: string]: PropertyDefinition}): Properties => {
    const propIris = Object.keys(props);

    const resProps = {};

    propIris.filter(
        (propIri: string) => {
            return typeGuard(props[propIri], ResourcePropertyDefinition);
        }
    ).forEach((propIri: string) => {
        resProps[propIri] = (props[propIri] as ResourcePropertyDefinition);
    });

    return resProps;
};

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <dsp-select-property #selectProp [formGroup]="form" [index]="0" [activeResourceClass]="activeResourceClass" [properties]="propertyDefs"></dsp-select-property>`
})
class TestHostComponent implements OnInit {

    @ViewChild('selectProp') selectProperty: SelectPropertyComponent;

    form: FormGroup;

    propertyDefs: { [index: string]: ResourcePropertyDefinition };

    activeResourceClass: ResourceClassDefinition;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

        const props = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties;

        const resProps = makeProperties(props);

        this.propertyDefs = resProps;
    }

}

describe('SelectPropertyComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    let loader: HarnessLoader;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                ReactiveFormsModule,
                MatSelectModule,
                MatOptionModule,
                MatCheckboxModule
            ],
            declarations: [
                SelectPropertyComponent,
                TestHostComponent
            ]
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
        expect(testHostComponent.selectProperty).toBeTruthy();
    });

    it('should initialise the Inputs correctly', () => {

        expect(testHostComponent.selectProperty.formGroup).toBeDefined();
        expect(testHostComponent.selectProperty.index).toEqual(0);
        expect(testHostComponent.selectProperty.activeResourceClass).toBeUndefined();
        expect(Object.keys(testHostComponent.selectProperty.properties).length).toEqual(28);
        expect(testHostComponent.selectProperty.propertiesAsArray.length).toEqual(22);
    });

    it('should add a new control to the parent form', async(() => {

        // the control is added to the form as an async operation
        // https://angular.io/guide/testing#async-test-with-async
        testHostFixture.whenStable().then(
            () => {
                expect(testHostComponent.form.contains('property0')).toBe(true);
            }
        );

    }));

    it('should init the MatSelect and MatOptions correctly', async () => {

        const select = await loader.getHarness(MatSelectHarness);
        const initVal = await select.getValueText();

        // placeholder
        expect(initVal).toEqual('Select Properties');

        await select.open();

        const options = await select.getOptions();

        expect(options.length).toEqual(22);

    });

    it('should set the active property', async () => {

        expect(testHostComponent.selectProperty.propertySelected).toBeUndefined();

        const select = await loader.getHarness(MatSelectHarness);
        await select.open();

        const options = await select.getOptions();

        await options[0].click();

        expect(testHostComponent.selectProperty.propertySelected.id).toEqual('http://0.0.0.0:3333/ontology/0001/anything/v2#hasBlueThing');
    });

    it('should not show the sort checkbox when no property is selected', async () => {

        const checkbox = await loader.getAllHarnesses(MatCheckboxHarness);

        expect(checkbox.length).toEqual(0);

    });

    it('should show the sort checkbox when a property with cardinality 1 is selected', async () => {

        const select = await loader.getHarness(MatSelectHarness);
        await select.open();

        const options = await select.getOptions();
        expect(await options[4].getText()).toEqual('Date');

        await options[4].click();

        const resClass = new ResourceClassDefinition();
        resClass.propertiesList = [{
            propertyIndex: 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate',
            cardinality: Cardinality._1,
            isInherited: true
        }];

        testHostComponent.activeResourceClass = resClass;

        testHostFixture.detectChanges();

        const checkbox = await loader.getAllHarnesses(MatCheckboxHarness);

        expect(checkbox.length).toEqual(1);

    });

    it('should reinitialise the properties',  async() => {

        expect(testHostComponent.selectProperty.propertySelected).toBeUndefined();

        const select = await loader.getHarness(MatSelectHarness);
        await select.open();

        const options = await select.getOptions();

        await options[0].click();

        expect(testHostComponent.selectProperty.propertySelected.id).toEqual('http://0.0.0.0:3333/ontology/0001/anything/v2#hasBlueThing');

        const props = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties;

        testHostComponent.propertyDefs = makeProperties(props);

        testHostFixture.detectChanges();

        expect(testHostComponent.selectProperty.propertySelected).toBeUndefined();
    });

    it('should remove the control from the parent form and unsubscribe from value changes when destroyed', async (() => {

        expect(testHostComponent.selectProperty.propertyChangesSubscription.closed).toBe(false);

        // TODO: find out why testHostFixture.destroy() does not trigger the component's ngOnDestroy
        testHostComponent.selectProperty.ngOnDestroy();

        // the control is added to the form as an async operation
        // https://angular.io/guide/testing#async-test-with-async
        testHostFixture.whenStable().then(
            () => {
                expect(testHostComponent.form.contains('property0')).toBe(false);
                expect(testHostComponent.selectProperty.propertyChangesSubscription.closed).toBe(true);
            }
        );

    }));
});
