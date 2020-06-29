import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLinkValueComponent } from './search-link-value.component';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HarnessLoader } from '@angular/cdk/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DspApiConnectionToken } from '../../../../../core';
import {
    ReadResource,
    ReadResourceSequence,
    SearchEndpointV2,
    ValuesEndpointV2,
    WriteValueResponse
} from '@dasch-swiss/dsp-js';
import { of } from 'rxjs';
import { ILabelSearchParams } from '@dasch-swiss/dsp-js/src/api/v2/search/search-endpoint-v2';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IRI } from '../operator';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <dsp-search-link-value #linkVal [formGroup]="form" [restrictResourceClass]="resClass"></dsp-search-link-value>`
})
class TestHostComponent implements OnInit {

    form;

    @ViewChild('linkVal', {static: false}) linkValue: SearchLinkValueComponent;

    resClass: string;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});
        this.resClass = 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing';
    }
}

describe('SearchLinkValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    let loader: HarnessLoader;

    beforeEach(async(() => {

        const searchSpyObj = {
            v2: {
                search: jasmine.createSpyObj('search', ['doSearchByLabel']),
            }
        };

        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                ReactiveFormsModule,
                MatAutocompleteModule,
                MatInputModule
            ],
            declarations: [
                SearchLinkValueComponent,
                TestHostComponent
            ],
            providers: [
                {
                    provide: DspApiConnectionToken,
                    useValue: searchSpyObj
                }
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
        expect(testHostComponent.linkValue).toBeTruthy();
    });

    it('should have the correct resource class restriction', () => {
        // access the test host component's child
        expect(testHostComponent.linkValue).toBeTruthy();

        expect(testHostComponent.linkValue.restrictResourceClass).toEqual('http://0.0.0.0:3333/ontology/0001/anything/v2#Thing');
    });

    it('should search for resources by their label', async () => {

        const searchSpy = TestBed.inject(DspApiConnectionToken);

        (searchSpy.v2.search as jasmine.SpyObj<SearchEndpointV2>).doSearchByLabel.and.callFake(
            (searchTerm: string, offset?: number, params?: ILabelSearchParams) => {

                const res = new ReadResource();
                res.id = 'http://testIri';
                res.label = 'testres';

                const response = new ReadResourceSequence([res]);

                return of(response);
            }
        );

        const autoCompleteHarness = await loader.getHarness(MatAutocompleteHarness);

        await autoCompleteHarness.enterText('testres');

        const options = await autoCompleteHarness.getOptions();

        expect(options.length).toEqual(1);
        expect(await options[0].getText()).toEqual('testres');

        expect(testHostComponent.linkValue.resources.length).toEqual(1);
        expect(testHostComponent.linkValue.resources[0].id).toEqual('http://testIri');

        // await autoCompleteHarness.selectOption({text: 'testres'});
        // await options[0].click();

        expect(searchSpy.v2.search.doSearchByLabel).toHaveBeenCalledTimes(5); // starts sending requests when 3 chars long: 'testres' -> tes (1) + tres (4)
        expect(searchSpy.v2.search.doSearchByLabel).toHaveBeenCalledWith('testres', 0, { limitToResourceClass: 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing'});

    });

    it('should return a selected resource', () => {

        const res = new ReadResource();
        res.id = 'http://testIri';

        testHostComponent.linkValue.form.controls['resource'].setValue(res);

        testHostFixture.detectChanges();

        expect(testHostComponent.linkValue.getValue()).toEqual(new IRI('http://testIri'));
    });

});
