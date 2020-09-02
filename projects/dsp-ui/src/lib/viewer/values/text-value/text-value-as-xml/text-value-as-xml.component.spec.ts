import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextValueAsXMLComponent } from './text-value-as-xml.component';
import { Component, DebugElement, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { MockResource, ReadTextValueAsXml, UpdateTextValueAsXml } from '@dasch-swiss/dsp-js';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { CreateTextValueAsXml } from '@dasch-swiss/dsp-js/index';

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: 'ckeditor',
    template: ``,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => TestCKEditorComponent),
        }
    ]
})
class TestCKEditorComponent implements ControlValueAccessor {

    @Input() config;

    @Input() editor;

    value;

    onChange = (_: any) => {};

    constructor() {
    }

    writeValue(obj: any) {
        this.value = obj;
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
    }

    _handleInput(): void {
        this.onChange(this.value);
    }

}

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <dsp-text-value-as-xml #inputVal [displayValue]="displayInputVal" [mode]="mode"></dsp-text-value-as-xml>`
})
class TestHostDisplayValueComponent implements OnInit {

    @ViewChild('inputVal') inputValueComponent: TextValueAsXMLComponent;

    displayInputVal: ReadTextValueAsXml;

    mode: 'read' | 'update' | 'create' | 'search';

    ngOnInit() {

        MockResource.getTestthing().subscribe(
            res => {

                this.displayInputVal = res.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasRichtext', ReadTextValueAsXml)[0];

                this.mode = 'read';
            }
        );

    }
}

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
    <dsp-text-value-as-xml #inputVal [mode]="mode"></dsp-text-value-as-xml>`
})
class TestHostCreateValueComponent implements OnInit {

    @ViewChild('inputVal') inputValueComponent: TextValueAsXMLComponent;

    mode: 'read' | 'update' | 'create' | 'search';

    ngOnInit() {

        this.mode = 'create';

    }
}

describe('TextValueAsXMLComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TextValueAsXMLComponent,
                TestHostDisplayValueComponent,
                TestCKEditorComponent,
                TestHostCreateValueComponent
            ],
            imports: [
                ReactiveFormsModule,
                MatInputModule,
                BrowserAnimationsModule
            ]
        })
            .compileComponents();
    }));

    describe('display and edit a text value with xml markup', () => {
        let testHostComponent: TestHostDisplayValueComponent;
        let testHostFixture: ComponentFixture<TestHostDisplayValueComponent>;
        let ckeditorDe: DebugElement;

        beforeEach(() => {
            testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
            testHostComponent = testHostFixture.componentInstance;
            testHostFixture.detectChanges();

            const hostCompDe = testHostFixture.debugElement;

            ckeditorDe = hostCompDe.query(By.directive(TestCKEditorComponent));
        });

        it('should display an existing value', () => {

            expect(testHostComponent.inputValueComponent.displayValue.xml).toEqual('<?xml version="1.0" encoding="UTF-8"?>\n<text><p>test with <strong>markup</strong></p></text>');

            expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

            expect(testHostComponent.inputValueComponent.mode).toEqual('read');

            expect(testHostComponent.inputValueComponent.valueFormControl.disabled).toBeTruthy();

            expect(ckeditorDe.componentInstance.value).toEqual('\n<p>test with <strong>markup</strong></p>');

        });

        it('should make an existing value editable', () => {

            testHostComponent.mode = 'update';

            testHostFixture.detectChanges();

            expect(testHostComponent.inputValueComponent.mode).toEqual('update');

            expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

            expect(testHostComponent.inputValueComponent.valueFormControl.disabled).toBeFalsy();

            expect(ckeditorDe.componentInstance.value).toEqual('\n<p>test with <strong>markup</strong></p>');

            // simulate input in ckeditor
            ckeditorDe.componentInstance.value = '\n<p>test with a lot of <strong>markup</strong></p>';
            ckeditorDe.componentInstance._handleInput();

            testHostFixture.detectChanges();

            expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

            const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

            expect(updatedValue instanceof UpdateTextValueAsXml).toBeTruthy();

            expect((updatedValue as UpdateTextValueAsXml).xml).toEqual('<?xml version="1.0" encoding="UTF-8"?><text>\n' +
                '<p>test with a lot of <strong>markup</strong></p></text>');

        });

        it('should not return an invalid update value', () => {

            testHostComponent.mode = 'update';

            testHostFixture.detectChanges();

            expect(testHostComponent.inputValueComponent.mode).toEqual('update');

            expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

            expect(ckeditorDe.componentInstance.value).toEqual('\n<p>test with <strong>markup</strong></p>');

            // simulate input in ckeditor
            ckeditorDe.componentInstance.value = '';
            ckeditorDe.componentInstance._handleInput();

            testHostFixture.detectChanges();

            expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

            const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

            expect(updatedValue).toBeFalsy();

        });

        it('should restore the initially displayed value', () => {

            testHostComponent.mode = 'update';

            testHostFixture.detectChanges();

            expect(testHostComponent.inputValueComponent.mode).toEqual('update');

            expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

            expect(ckeditorDe.componentInstance.value).toEqual('\n<p>test with <strong>markup</strong></p>');

            // simulate input in ckeditor
            ckeditorDe.componentInstance.value = '<p>updated text<p></p>';
            ckeditorDe.componentInstance._handleInput();

            testHostFixture.detectChanges();

            testHostComponent.inputValueComponent.resetFormControl();

            expect(ckeditorDe.componentInstance.value).toEqual('\n<p>test with <strong>markup</strong></p>');

            expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

        });

        it('should set a new display value', () => {

            const newXml = new ReadTextValueAsXml();

            newXml.xml = '<?xml version="1.0" encoding="UTF-8"?><text><p>my updated text<p></text>';
            newXml.mapping = 'http://rdfh.ch/standoff/mappings/StandardMapping';

            newXml.id = 'updatedId';

            testHostComponent.displayInputVal = newXml;

            testHostFixture.detectChanges();

            expect(ckeditorDe.componentInstance.value).toEqual('<p>my updated text<p>');

            expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

        });

        it('convert markup received from CKEditor: <i> -> <em>', () => {

            testHostComponent.mode = 'update';

            testHostFixture.detectChanges();

            // simulate input in ckeditor
            ckeditorDe.componentInstance.value = '<p>test <i>with</i> a lot of <i>markup</i></p>';
            ckeditorDe.componentInstance._handleInput();

            testHostFixture.detectChanges();

            expect((testHostComponent.inputValueComponent.getUpdatedValue() as UpdateTextValueAsXml).xml)
                .toEqual('<?xml version="1.0" encoding="UTF-8"?><text><p>test <em>with</em> a lot of <em>markup</em></p></text>');

        });

    });

    describe('create a text value with markup', () => {

        let testHostComponent: TestHostCreateValueComponent;
        let testHostFixture: ComponentFixture<TestHostCreateValueComponent>;
        let ckeditorDe: DebugElement;

        let valueComponentDe: DebugElement;
        let commentInputDebugElement: DebugElement;
        let commentInputNativeElement;

        beforeEach(() => {
            testHostFixture = TestBed.createComponent(TestHostCreateValueComponent);
            testHostComponent = testHostFixture.componentInstance;
            testHostFixture.detectChanges();

            const hostCompDe = testHostFixture.debugElement;

            ckeditorDe = hostCompDe.query(By.directive(TestCKEditorComponent));

            valueComponentDe = hostCompDe.query(By.directive(TextValueAsXMLComponent));
            commentInputDebugElement = valueComponentDe.query(By.css('textarea.comment'));
            commentInputNativeElement = commentInputDebugElement.nativeElement;
        });

        it('should create a value', () => {

            // simulate input in ckeditor
            ckeditorDe.componentInstance.value = '<p>created text<p></p>';
            ckeditorDe.componentInstance._handleInput();

            testHostFixture.detectChanges();

            expect(testHostComponent.inputValueComponent.mode).toEqual('create');
            expect(testHostComponent.inputValueComponent.valueFormControl.disabled).toBeFalsy();

            expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

            const newValue = testHostComponent.inputValueComponent.getNewValue();

            expect(newValue instanceof CreateTextValueAsXml).toBeTruthy();

            expect((newValue as CreateTextValueAsXml).xml).toEqual('<?xml version="1.0" encoding="UTF-8"?><text><p>created text<p></p></text>');
            expect((newValue as CreateTextValueAsXml).mapping).toEqual('http://rdfh.ch/standoff/mappings/StandardMapping');
        });

        it('should reset form after cancellation', () => {
            ckeditorDe.componentInstance.value = '<p>created text<p></p>';
            ckeditorDe.componentInstance._handleInput();

            commentInputNativeElement.value = 'created comment';

            commentInputNativeElement.dispatchEvent(new Event('input'));

            testHostFixture.detectChanges();

            expect(testHostComponent.inputValueComponent.mode).toEqual('create');

            expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

            testHostComponent.inputValueComponent.resetFormControl();

            expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

            expect(ckeditorDe.componentInstance.value).toEqual(null);

            expect(commentInputNativeElement.value).toEqual('');

        });

    });

});
