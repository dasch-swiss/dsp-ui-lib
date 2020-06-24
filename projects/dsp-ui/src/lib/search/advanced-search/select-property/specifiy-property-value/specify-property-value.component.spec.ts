import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecifyPropertyValueComponent } from './specify-property-value.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MockOntology, PropertyDefinition, ResourceClassDefinition, ResourcePropertyDefinition } from '@dasch-swiss/dsp-js';
import { Properties, SelectPropertyComponent } from '../select-property.component';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';

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
        <dsp-specify-property-value #specifyProp [formGroup]="form" [property]="propertyDef"></dsp-specify-property-value>`
})
class TestHostComponent implements OnInit {

    @ViewChild('specifyProp') specifyProperty: SpecifyPropertyValueComponent;

    form: FormGroup;

    propertyDef: ResourcePropertyDefinition;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

        const props = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties;

        const resProps = makeProperties(props);

        this.propertyDef = resProps['http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger'];
    }

}

describe('SpecifyPropertyValueComponent', () => {
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
                SpecifyPropertyValueComponent,
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
        expect(testHostComponent.specifyProperty).toBeTruthy();
    });

    it('should initialise the Inputs correctly', () => {

        expect(testHostComponent.specifyProperty.formGroup).toBeDefined();
        expect(testHostComponent.specifyProperty.property).toBeDefined();
        expect(testHostComponent.specifyProperty.property.id).toEqual('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger');
    });

    it('should add a new control to the parent form', async(() => {

        // the control is added to the form as an async operation
        // https://angular.io/guide/testing#async-test-with-async
        testHostFixture.whenStable().then(
            () => {
                expect(testHostComponent.form.contains('comparisonOperator')).toBe(true);
            }
        );

    }));

    it('should set the correct comparison operators for the given property type', () => {
        expect(testHostComponent.specifyProperty.comparisonOperators.length).toEqual(7);
    });

    it('should init the MatSelect and MatOptions correctly', async () => {

        const select = await loader.getHarness(MatSelectHarness);
        const initVal = await select.getValueText();

        // placeholder
        expect(initVal).toEqual('Comparison Operator');

        await select.open();

        const options = await select.getOptions();

        expect(options.length).toEqual(7);

    });

    it('should unsubscribe from from changes on destruction', () => {

        expect(testHostComponent.specifyProperty.comparisonOperatorChangesSubscription.closed).toBe(false);

        testHostFixture.destroy();

        expect(testHostComponent.specifyProperty.comparisonOperatorChangesSubscription.closed).toBe(true);

    });
});
