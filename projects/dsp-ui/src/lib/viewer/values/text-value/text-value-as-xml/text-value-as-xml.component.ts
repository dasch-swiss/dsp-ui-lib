import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Constants, CreateTextValueAsXml, ReadTextValueAsXml, UpdateTextValueAsXml } from '@dasch-swiss/dsp-js';
import * as Editor from 'ckeditor5-custom-build';
import { Subscription } from 'rxjs';
import { AppInitService } from '../../../../core/app-init.service';
import { BaseValueComponent } from '../../base-value.component';
import { ValueErrorStateMatcher } from '../../value-error-state-matcher';

@Component({
    selector: 'dsp-text-value-as-xml',
    templateUrl: './text-value-as-xml.component.html',
    styleUrls: ['./text-value-as-xml.component.scss']
})
export class TextValueAsXMLComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {

    @Input() displayValue?: ReadTextValueAsXml;
    @Input() mapping = 'http://rdfh.ch/standoff/mappings/StandardMapping'; // TODO: define this somewhere else

    valueFormControl: FormControl;
    commentFormControl: FormControl;

    form: FormGroup;

    valueChangesSubscription: Subscription;
    matcher = new ValueErrorStateMatcher();
    customValidators = [];

    // https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html
    editor: Editor;
    editorConfig;

    // TODO: get this from config via AppInitService
    readonly resourceBasePath = 'http://rdfh.ch/';

    constructor(private _appInitService: AppInitService,
                @Inject(FormBuilder) private fb: FormBuilder) {
        super();
    }

    getInitValue(): string | null {

        // check for standard mapping
        if (this.displayValue !== undefined) {

            // strip the doctype and text tag
            console.log('text before conversion: ', this.displayValue.xml);
            const converted = this._handleXML(this.displayValue.xml, true);
            console.log('text after conversion: ', converted);

            return converted;
        } else {
            return null;
        }
    }

    ngOnInit() {

        if (this.mapping !== undefined
            && this.mapping === 'http://rdfh.ch/standoff/mappings/StandardMapping'
            && this._appInitService.config['xmlTransform'] !== undefined
            && this._appInitService.config['xmlTransform'][this.mapping] !== undefined) {

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
                                return url.startsWith(this.resourceBasePath);
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
        }
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
        newTextValue.mapping = this.mapping;

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
        updatedTextValue.mapping = this.mapping;

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
            // CKEditor accepts tags from version 4
            // see 4 to 5 migration, see https://ckeditor.com/docs/ckeditor5/latest/builds/guides/migrate.html
            // CKEditor 5 uses <i> for italics so we need to convert the <em> tags from knora to <i> so that the validator works
            return xml.replace(doctype, '')
                .replace(openingTextTag, '')
                .replace(closingTextTag, '')
                .replace('<em>', '<i>')
                .replace('</em>', '</i>');
        } else {

            // replace &nbsp; entity
            xml = xml.replace(/&nbsp;/g, String.fromCharCode(160));

            // get XML transform config
            const keys = Object.keys(this._appInitService.config['xmlTransform'][this.mapping]);
            for (const key of keys) {
                // replace tags defined in config
                xml = xml.replace(new RegExp(key, 'g'), this._appInitService.config['xmlTransform'][this.mapping][key]);
            }

            return doctype + openingTextTag + xml + closingTextTag;
        }

    }
}
