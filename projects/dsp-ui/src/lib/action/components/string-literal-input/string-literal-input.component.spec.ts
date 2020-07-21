import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StringLiteral } from '@dasch-swiss/dsp-js';
import { DspApiConnectionToken, SessionService } from '../../../core';
import { StringLiteralInputComponent } from './string-literal-input.component';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
    <dsp-string-literal-input
        #stringLiteralInputVal
        [placeholder]="'List label'"
        [value]="labels"
        [language]="language">
    </dsp-string-literal-input>`
})
class TestHostStringLiteralSimpleInputComponent implements OnInit {

    @ViewChild('stringLiteralInputVal') stringLiteralSimpleInputComponent: StringLiteralInputComponent;

    labels: StringLiteral[];

    language: string;

    ngOnInit() {
        this.labels = [];

        this.language = 'en';
    }
}

describe('StringLiteralInputComponent', () => {
    let testHostComponent: TestHostStringLiteralSimpleInputComponent;
    let testHostFixture: ComponentFixture<TestHostStringLiteralSimpleInputComponent>;
    let loader: HarnessLoader;
    let sessionService: SessionService;

    beforeEach(async(() => {

        // empty spy object to use in the providers for the SessionService injection
        const dspConnSpy = { };

        TestBed.configureTestingModule({
            declarations: [
                StringLiteralInputComponent,
                TestHostStringLiteralSimpleInputComponent
            ],
            imports: [
                MatMenuModule,
                MatInputModule,
                MatIconModule,
                MatButtonToggleModule,
                MatFormFieldModule,
                BrowserAnimationsModule,
                ReactiveFormsModule
            ],
            providers: [
                {
                    provide: DspApiConnectionToken,
                    useValue: dspConnSpy
                },
                SessionService
            ]
        })
        .compileComponents();

        sessionService = TestBed.inject(SessionService);
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestHostStringLiteralSimpleInputComponent);
        testHostComponent = testHostFixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(testHostFixture);
        testHostFixture.detectChanges();
        expect(testHostComponent.stringLiteralSimpleInputComponent).toBeTruthy();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should load values and assign them to the correct language', async () => {
        testHostComponent.labels = [
            {
                value: 'Welt',
                language: 'de'
            },
            {
                value: 'World',
                language: 'en'
            },
            {
                value: 'Monde',
                language: 'fr'
            },
            {
                value: 'Mondo',
                language: 'it'
            },
        ];

        // testHostComponent.stringLiteralSimpleInputComponent.setLanguage('en');

        testHostFixture.detectChanges();

        const inputElement = await loader.getHarness(MatInputHarness.with({selector: '.inputValue'}));

        // expect(await inputElement.getValue()).toEqual('World');

        testHostComponent.stringLiteralSimpleInputComponent.setLanguage('de');

        testHostFixture.detectChanges();

        expect(await inputElement.getValue()).toEqual('Welt');

        expect(testHostComponent).toBeTruthy();
    });
});
