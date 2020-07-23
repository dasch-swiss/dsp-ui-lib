import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StringLiteral } from '@dasch-swiss/dsp-js';
import { DspApiConnectionToken, SessionService } from '../../../core';
import { StringLiteralInputComponent } from './string-literal-input.component';
import { MatMenuHarness } from '@angular/material/menu/testing';

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
        // this.labels = [];

        this.labels = [
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

    it('should create an instance', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostComponent.stringLiteralSimpleInputComponent).toBeTruthy();
    });

    it('should load values and assign them to the correct language', async () => {

        const inputElement = await loader.getHarness(MatInputHarness.with({selector: '.inputValue'}));

        expect(await inputElement.getValue()).toEqual('World');

        testHostComponent.stringLiteralSimpleInputComponent.setLanguage('de');

        testHostFixture.detectChanges();

        expect(await inputElement.getValue()).toEqual('Welt');

        testHostComponent.stringLiteralSimpleInputComponent.setLanguage('fr');

        testHostFixture.detectChanges();

        expect(await inputElement.getValue()).toEqual('Monde');

        testHostComponent.stringLiteralSimpleInputComponent.setLanguage('it');

        testHostFixture.detectChanges();

        expect(await inputElement.getValue()).toEqual('Mondo');
    });

    it('should change a value and assign it to the correct language', async () => {

        const inputElement = await loader.getHarness(MatInputHarness.with({selector: '.inputValue'}));

        const langSelectButtonElement = await loader.getHarness(MatButtonHarness.with({selector: '.select-lang'}));

        console.log(langSelectButtonElement);

        expect(langSelectButtonElement).toBeDefined();

        await langSelectButtonElement.click();

        // const langMenuElement = await loader.getHarness(MatMenuHarness.with({selector: '.lang-menu'}));

        // console.log(langMenuElement);

        // expect(await inputElement.getValue()).toEqual('World');

        // expect(await inputElement.getValue()).toEqual('Hello World');
    });
});
