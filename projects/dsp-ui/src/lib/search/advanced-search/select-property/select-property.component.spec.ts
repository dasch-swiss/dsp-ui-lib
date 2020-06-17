import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPropertyComponent } from './select-property.component';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MockOntology, ResourcePropertyDefinition } from '@dasch-swiss/dsp-js';
import { MatSelectHarness } from '@angular/material/select/testing';

// https://dev.to/krumpet/generic-type-guard-in-typescript-258l
type Constructor<T> = { new(...args: any[]): T };

const typeGuard = <T>(o: any, className: Constructor<T>): o is T => {
    return o instanceof className;
};

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <dsp-select-property #selectProp [formGroup]="form" [index]="0" [activeResourceClass]="undefined" [properties]="propertyDefs"></dsp-select-property>`
})
class TestHostComponent implements OnInit {

    @ViewChild('selectProp') selectProperty: SelectPropertyComponent;

    form: FormGroup;

    propertyDefs: { [index: string]: ResourcePropertyDefinition };

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

        const props = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties;

        const propIris = Object.keys(props);

        // console.log(props);

        const resProps = {};

        propIris.filter(
            (propIri: string) => {
                return typeGuard(props[propIri], ResourcePropertyDefinition);
            }
        ).forEach((propIri: string) => {
            resProps[propIri] = (props[propIri] as ResourcePropertyDefinition);
        });

        // console.log(resProps)

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
                MatOptionModule
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
});
