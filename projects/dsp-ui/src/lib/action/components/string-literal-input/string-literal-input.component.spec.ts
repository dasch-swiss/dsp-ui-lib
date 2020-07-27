import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { By } from '@angular/platform-browser';
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
        [language]="language"
        [textarea]="isTextarea">
    </dsp-string-literal-input>`
})
class TestHostStringLiteralInputComponent implements OnInit {

    @ViewChild('stringLiteralInputVal') stringLiteralInputComponent: StringLiteralInputComponent;

    labels: StringLiteral[];

    language: string;

    isTextarea: boolean;

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
    let testHostComponent: TestHostStringLiteralInputComponent;
    let testHostFixture: ComponentFixture<TestHostStringLiteralInputComponent>;
    let loader: HarnessLoader;
    let sessionService: SessionService;

    let sliComponentDe: DebugElement;
    let sliMenuDebugElement: DebugElement;
    let sliMenuNativeElement;
    let langButton;

    beforeEach(async(() => {

        // empty spy object to use in the providers for the SessionService injection
        const dspConnSpy = { };

        TestBed.configureTestingModule({
            declarations: [
                StringLiteralInputComponent,
                TestHostStringLiteralInputComponent
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
        testHostFixture = TestBed.createComponent(TestHostStringLiteralInputComponent);
        testHostComponent = testHostFixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(testHostFixture);
        testHostFixture.detectChanges();
        expect(testHostComponent).toBeTruthy();
        expect(testHostComponent.stringLiteralInputComponent).toBeTruthy();
    });

    it('should load values and assign them to the correct language', async () => {

        const inputElement = await loader.getHarness(MatInputHarness.with({selector: '.inputValue'}));

        expect(await inputElement.getValue()).toEqual('World');

        testHostComponent.stringLiteralInputComponent.setLanguage('de');

        testHostFixture.detectChanges();

        expect(await inputElement.getValue()).toEqual('Welt');

        testHostComponent.stringLiteralInputComponent.setLanguage('fr');

        testHostFixture.detectChanges();

        expect(await inputElement.getValue()).toEqual('Monde');

        testHostComponent.stringLiteralInputComponent.setLanguage('it');

        testHostFixture.detectChanges();

        expect(await inputElement.getValue()).toEqual('Mondo');
    });

    it('should change a value and assign it to the correct language', async () => {

        const hostCompDe = testHostFixture.debugElement;
        sliComponentDe = hostCompDe.query(By.directive(StringLiteralInputComponent));

        const inputElement = await loader.getHarness(MatInputHarness.with({selector: '.inputValue'}));

        const langSelectButtonElement = await loader.getHarness(MatButtonHarness.with({selector: '.select-lang'}));

        expect(langSelectButtonElement).toBeDefined();

        // open language select button
        await langSelectButtonElement.click();

        // why doesn't this work....

        // const langMenuElement = await loader.getHarness(MatMenuHarness.with({selector: '.lang-menu'}));

        // console.log(langMenuElement);

        // const langButtonArray = await loader.getAllHarnesses(MatButtonHarness.with({selector: '.lang-button'}));

        // console.log(langButtonArray);

        // old-school way works

        // get reference to the mat-menu
        sliMenuDebugElement = sliComponentDe.query(By.css('.lang-menu'));

        // get reference to mat-menu native element in order to be able to access the buttons
        sliMenuNativeElement = sliMenuDebugElement.nativeElement;

        // select 'de' button
        langButton = sliMenuNativeElement.children[0].children[0];

        // simulate a user click on the button element to switch input value to the german value
        langButton.click();

        // expect the value of the german input to equal 'Welt'
        expect(await inputElement.getValue()).toEqual('Welt');

        // set new value for the german text
        await inputElement.setValue('neue Welt');

        // select 'fr' button
        langButton = sliMenuNativeElement.children[0].children[1];

        // switch to french
        langButton.click();

        // expect the value of the french input to equal 'Monde'
        expect(await inputElement.getValue()).toEqual('Monde');

        // select 'de' button
        langButton = sliMenuNativeElement.children[0].children[0];

        // switch back to german
        langButton.click();

        // expect the value to equal the new value given earlier
        expect(await inputElement.getValue()).toEqual('neue Welt');

    });

    it('should switch input to a textarea', async () => {
        testHostComponent.isTextarea = true;

        testHostFixture.detectChanges();

        const inputElement = await loader.getHarness(MatInputHarness.with({selector: '.textAreaValue'}));

        console.log(inputElement);

        expect(inputElement).toBeDefined();

        expect(await inputElement.getValue()).toEqual('World');

        testHostComponent.stringLiteralInputComponent.setLanguage('de');

        testHostFixture.detectChanges();

        expect(await inputElement.getValue()).toEqual('Welt');

        testHostComponent.stringLiteralInputComponent.setLanguage('fr');

        testHostFixture.detectChanges();

        expect(await inputElement.getValue()).toEqual('Monde');

        testHostComponent.stringLiteralInputComponent.setLanguage('it');

        testHostFixture.detectChanges();

        expect(await inputElement.getValue()).toEqual('Mondo');

        const langSelectButtonElement = await loader.getAllHarnesses(MatButtonHarness.with({selector: '.lang-toggle-button'}));

        console.log(langSelectButtonElement);

        expect(langSelectButtonElement).toBeDefined();

    });
});
