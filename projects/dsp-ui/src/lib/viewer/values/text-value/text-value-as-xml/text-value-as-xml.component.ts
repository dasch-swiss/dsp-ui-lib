import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { BaseValueComponent } from '../../base-value.component';
import { CreateTextValueAsXml, ReadTextValueAsXml, UpdateTextValueAsXml } from '@dasch-swiss/dsp-js';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ValueErrorStateMatcher } from '../../value-error-state-matcher';
import * as Editor from 'ckeditor5-custom-build';

@Component({
    selector: 'dsp-text-value-as-xml',
    templateUrl: './text-value-as-xml.component.html',
    styleUrls: ['./text-value-as-xml.component.scss']
})
export class TextValueAsXMLComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {

    @Input() displayValue?: ReadTextValueAsXml;

    valueFormControl: FormControl;
    commentFormControl: FormControl;

    form: FormGroup;

    valueChangesSubscription: Subscription;
    matcher = new ValueErrorStateMatcher();
    customValidators = [];

    editor: Editor;
    editorConfig;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
        super();
    }

    getInitValue(): string | null {

        // convert tags: CKEditor 4 to 5 migration, see https://ckeditor.com/docs/ckeditor5/latest/builds/guides/migrate.html

        if (this.displayValue !== undefined) {
            if (this.displayValue.mapping !== 'http://rdfh.ch/standoff/mappings/StandardMapping') {
                // mapping is not supported
                return null;
            }

            // strip the doctype and text tag
            return this.displayValue.xml
                .replace('<?xml version="1.0" encoding="UTF-8"?>', '')
                .replace('<text>', '')
                .replace('</text>', '');
        } else {
            return null;
        }
    }

    ngOnInit() {

        // check for standard mapping

        this.editor = Editor;

        this.editorConfig = {
            // format_tags: 'p;h1;h2;h3;h4;h5;h6;pre',
            entities: false,
            toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'underline', 'strikethrough', 'subscript', 'superscript', 'horizontalline', 'insertTable', 'removeformat']
        };

        // initialize form control elements
        this.valueFormControl = new FormControl({ value: null, disabled: this.mode === 'read'});

        this.commentFormControl = new FormControl(null);

        this.valueChangesSubscription = this.commentFormControl.valueChanges.subscribe(
            data => {
                this.valueFormControl.updateValueAndValidity();
            }
        );

        this.form = this.fb.group({
            xmlValue: this.valueFormControl,
            comment: this.commentFormControl
        });

        this.resetFormControl();

    }

    ngOnChanges(changes: SimpleChanges): void {

        // resets values and validators in form controls when input displayValue or mode changes
        // at the first call of ngOnChanges, form control elements are not initialized yet
        this.resetFormControl();

        // mode is controlled via the FormControl
        if (this.valueFormControl !== undefined && this.mode === 'read') {
            this.valueFormControl.disable();
        } else if (this.valueFormControl !== undefined) {
            this.valueFormControl.enable();
        }


    }

    ngOnDestroy(): void {
        this.unsubscribeFromValueChanges();
    }

    getNewValue(): CreateTextValueAsXml | false {

        if (this.mode !== 'create' || !this.form.valid) {
            return false;
        }

        const newTextValue = new CreateTextValueAsXml();

        // TODO: add doctype and the text tag
        newTextValue.xml = this.valueFormControl.value;
        newTextValue.mapping = 'http://rdfh.ch/standoff/mappings/StandardMapping';

        if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
            newTextValue.valueHasComment = this.commentFormControl.value;
        }

        return newTextValue;

    }

    getUpdatedValue(): UpdateTextValueAsXml | false {

        if (this.mode !== 'update' || !this.form.valid) {
            return false;
        }

        const updatedTextValue = new UpdateTextValueAsXml();

        updatedTextValue.id = this.displayValue.id;

        // TODO: add doctype and the text tag
        updatedTextValue.xml = this.valueFormControl.value;

        updatedTextValue.mapping = 'http://rdfh.ch/standoff/mappings/StandardMapping';

        if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
            updatedTextValue.valueHasComment = this.commentFormControl.value;
        }

        return updatedTextValue;
    }
}
