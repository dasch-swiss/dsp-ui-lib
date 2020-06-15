import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectResourceClassComponent } from './select-resource-class.component';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MockOntology, ResourceClassDefinition } from '@dasch-swiss/dsp-js';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
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
        <dsp-select-resource-class #selectResClass [formGroup]="form" [resourceClassDefinitions]="resourceClassDefs"
                                   (resourceClassSelected)="resClassSelected($event)"></dsp-select-resource-class>`
})
class TestHostComponent implements OnInit {

    @ViewChild('selectResClass') selectResourceClass: SelectResourceClassComponent;

    form: FormGroup;

    resourceClassDefs: ResourceClassDefinition[];

    selectedResClassIri: string;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

        const resClasses = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').classes;

        const resClassIris = Object.keys(resClasses);

        // get resource class defs
        this.resourceClassDefs = resClassIris.filter(resClassIri => {
            return typeGuard(resClasses[resClassIri], ResourceClassDefinition);
        }).map(
            (resClassIri: string) => {
                return resClasses[resClassIri] as ResourceClassDefinition;
            }
        );

    }

    resClassSelected(resClassIri: string) {
        this.selectedResClassIri = resClassIri;
    }
}


describe('SelectResourceClassComponent', () => {
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
                SelectResourceClassComponent,
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
        expect(testHostComponent.selectResourceClass).toBeTruthy();
    });

    it('should init the MatSelect and MatOptions correctly', async () => {

        const select = await loader.getHarness(MatSelectHarness);
        const initVal = await select.getValueText();

        // placeholder
        expect(initVal).toEqual('Select a Resource Class (optional)');

        await select.open();

        const options = await select.getOptions();

        expect(options.length).toEqual(9);

        const option1 = await options[0].getText();

        expect(option1).toEqual('no selection');

        const option2 = await options[1].getText();

        expect(option2).toEqual('Blue thing');


    });
});
