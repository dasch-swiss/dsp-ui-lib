import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Constants, CreateTextValueAsXml, ReadTextValueAsXml, UpdateTextValueAsXml } from '@dasch-swiss/dsp-js';
import * as Editor from 'ckeditor5-custom-build';
import { Subscription } from 'rxjs';
import { BaseValueComponent } from '../../base-value.component';
import { ValueErrorStateMatcher } from '../../value-error-state-matcher';

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);

@Component({
    selector: 'dsp-text-value-as-xml',
    templateUrl: './text-value-as-xml.component.html',
    styleUrls: ['./text-value-as-xml.component.scss']
})
export class TextValueAsXMLComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {

    readonly standardMapping = 'http://rdfh.ch/standoff/mappings/StandardMapping'; // TODO: define this somewhere else

    @Input() displayValue?: ReadTextValueAsXml;

    valueFormControl: FormControl;
    commentFormControl: FormControl;

    form: FormGroup;

    valueChangesSubscription: Subscription;
    matcher = new ValueErrorStateMatcher();
    customValidators = [];

    // https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html
    editor: Editor;
    editorConfig;

    // XML conversion
    xmlTransform = {
        '<hr>': '<hr/>',
        '</hr>': '',
        '<s>': '<strike>',
        '</s>': '</strike>',
        '<i>': '<em>',
        '</i>': '</em>',
        '<figure class="table">': '',
        '</figure>': ''
    };

    // TODO: get this from config via AppInitService
    readonly resourceBasePath = 'http://rdfh.ch/';

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
        super();
    }

    standardValueComparisonFunc(initValue: any, curValue: any): boolean {
        const initValueTrimmed = typeof initValue === 'string' ? initValue.trim() : initValue;
        const curValueTrimmed = typeof curValue === 'string' ? curValue.trim() : curValue;

        return initValueTrimmed === this._handleXML(curValueTrimmed, false, false);
    }

    getInitValue(): string | null {

        // check for standard mapping
        if (this.displayValue !== undefined && this.displayValue.mapping === this.standardMapping) {
            return this._handleXML(this.displayValue.xml, true);
        } else {
            return null;
        }
    }

    ngOnInit() {

        this.editor = Editor;

        this.editorConfig = {
            entities: false,
            link: {
                addTargetToExternalLinks: false,
                decorators: {
                    isInternal: {
                        // label: 'internal link to a Knora resource',
                        mode: 'automatic', // automatic requires callback -> but the callback is async and the user could save the text before the check ...
                        callback: url => { /*console.log(url, url.startsWith( 'http://rdfh.ch/' ));*/
                            return !!url && url.startsWith(this.resourceBasePath);
                        },
                        attributes: {
                            class: Constants.SalsahLink
                        }
                    }
                }
            },
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
            codeBlock: {
                languages: [
                    {language: 'plaintext', label: 'Plain text', class: ''}
                ]
            }
        };

        // initialize form control elements
        this.valueFormControl = new FormControl(null);

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

        resolvedPromise.then(() => {
            // add form to the parent form group
            this.addToParentFormGroup(this.formName, this.form);
        });

    }

    ngOnChanges(changes: SimpleChanges): void {

        // resets values and validators in form controls when input displayValue or mode changes
        // at the first call of ngOnChanges, form control elements are not initialized yet
        this.resetFormControl();

    }

    ngOnDestroy(): void {
        this.unsubscribeFromValueChanges();

        resolvedPromise.then(() => {
            // remove form from the parent form group
            this.removeFromParentFormGroup(this.formName);
        });
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
     * @param addXMLDocType whether to add the doctype to the XML.
     */
    private _handleXML(xml: string, fromKnora: boolean, addXMLDocType = true) {

        const doctype = '<?xml version="1.0" encoding="UTF-8"?>';
        const textTag = 'text';
        const openingTextTag = `<${textTag}>`;
        const closingTextTag = `</${textTag}>`;

        // check if xml is a string
        if (typeof xml !== 'string') {
            return xml;
        }

        if (fromKnora) {
            // CKEditor accepts tags from version 4
            // see 4 to 5 migration, see https://ckeditor.com/docs/ckeditor5/latest/builds/guides/migrate.html
            return xml.replace(doctype, '')
                .replace(openingTextTag, '')
                .replace(closingTextTag, '');
        } else {

            // replace &nbsp; entity
            xml = xml.replace(/&nbsp;/g, String.fromCharCode(160));

            // get XML transform config
            const keys = Object.keys(this.xmlTransform);
            for (const key of keys) {
                // replace tags defined in config
                xml = xml.replace(new RegExp(key, 'g'), this.xmlTransform[key]);
            }

            if (addXMLDocType) {
                return doctype + openingTextTag + xml + closingTextTag;
            } else {
                return xml;
            }
        }

    }
}
