import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectResourceClassComponent } from './select-resource-class.component';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ResourceClassDefinition } from '@knora/api';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <dsp-select-resource-class #selectResClass [formGroup]="form" [resourceClasses]="resourceClasses"
                                   (resourceClassSelected)="resClassSelected($event)"></dsp-select-resource-class>`
})
class TestHostComponent implements OnInit {

    @ViewChild('selectResClass') selectResourceClass: SelectResourceClassComponent;

    form: FormGroup;

    resourceClasses: ResourceClassDefinition[];

    selectedResClassIri: string;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

        this.resourceClasses = [];

    }

    resClassSelected(resClassIri: string) {

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
});
