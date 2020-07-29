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

    readonly standardMapping = 'http://rdfh.ch/standoff/mappings/StandardMapping';

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
        super();
    }

    getInitValue(): string | null {

        // convert tags: CKEditor 4 to 5 migration, see https://ckeditor.com/docs/ckeditor5/latest/builds/guides/migrate.html

        if (this.displayValue !== undefined) {
            if (this.displayValue.mapping !== this.standardMapping) {
                // mapping is not supported
                return null;
            }

            // strip the doctype and text tag
            return this._handleXML(this.displayValue.xml, true);
        } else {
            return null;
        }
    }

    ngOnInit() {

        // check for standard mapping

        this.editor = Editor;

        this.editorConfig = {
            entities: false,
            toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'underline', 'strikethrough', 'subscript', 'superscript', 'horizontalline', 'insertTable', 'code', 'codeBlock', 'removeformat', 'redo', 'undo'],
            heading: {
                options: [
                    {model: 'heading1', view: 'h1', title: 'Heading 1'},
                    {model: 'heading2', view: 'h2', title: 'Heading 2'},
                    {model: 'heading3', view: 'h3', title: 'Heading 3'},
                    {model: 'heading4', view: 'h4', title: 'Heading 4'},
                    {model: 'heading5', view: 'h5', title: 'Heading 5'},
                    {model: 'heading6', view: 'h6', title: 'Heading 6'},
                ]
            },
        };

        // initialize form control elements
        this.valueFormControl = new FormControl({value: null, disabled: this.mode === 'read'});

        this.commentFormControl = new FormControl(null);

        this.valueFormControl.valueChanges.subscribe(
            data => console.log(data)
        );

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

        newTextValue.xml = this._handleXML(this.valueFormControl.value, false);
        newTextValue.mapping = this.standardMapping;

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

        updatedTextValue.xml = this._handleXML(this.valueFormControl.value, false);
        updatedTextValue.mapping = this.standardMapping;

        if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
            updatedTextValue.valueHasComment = this.commentFormControl.value;
        }

        return updatedTextValue;
    }

    /**
     * Converts XML to HTML suitable for CKEditor and vice versa.
     *
     * @param xml xml to be processed.
     * @param fromKnora true if xml is received from Knora.
     */
    private _handleXML(xml: string, fromKnora: boolean) {

        const doctype = '<?xml version="1.0" encoding="UTF-8"?>';
        const textTag = 'text';
        const openingTextTag = `<${textTag}>`;
        const closingTextTag = `</${textTag}>`;

        if (fromKnora) {
            return xml.replace(doctype, '')
                .replace(openingTextTag, '')
                .replace(closingTextTag, '');
        } else {
            xml = xml.replace(/&nbsp;/g, String.fromCharCode(160))
                .replace(/<hr>/g, '<hr/>')
                .replace(/<\/hr>/g, '<hr/>')
                .replace(/<s>/g, '<strike>')
                .replace(/<\/s>/g, '</strike>')
                .replace(/<i>/g, '<em>')
                .replace(/<\/i>/g, '</em>')
                .replace(/<figure class="table">/g, '')
                .replace(/<\/figure>/g, '');
            return doctype + openingTextTag + xml + closingTextTag;
        }

    }
}
