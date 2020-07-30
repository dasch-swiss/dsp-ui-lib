import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextValueAsXMLComponent } from './text-value-as-xml.component';
import { Component, DebugElement, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ReadTextValueAsXml, MockResource } from '@dasch-swiss/dsp-js';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DateValueComponent } from '../../..';

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

    constructor() {
    }

    writeValue(obj: any) {
        this.value = obj;
    }

    registerOnChange(fn: any) {
    }

    registerOnTouched(fn: any) {
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

fdescribe('TextValueAsXMLComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TextValueAsXMLComponent,
                TestHostDisplayValueComponent,
                TestCKEditorComponent
            ],
            imports: [
                ReactiveFormsModule,
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

            expect(ckeditorDe.componentInstance.value).toEqual('\n<p>test with <strong>markup</strong></p>');

        });

    });

});
