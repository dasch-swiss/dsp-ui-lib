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

        if (this.displayValue !== undefined) {
            return this.displayValue.xml;
        } else {
            return null;
        }
    }

    ngOnInit() {

        // check for standard mapping

        this.editor = Editor;

        const filter = ' p em strong strike u sub sup hr h1 h2 h3 h4 h5 h6 pre table tbody tr td ol ul li cite blockquote code; a[!href](salsah-link) ';

        this.editorConfig = {
            allowedContent: filter,
            pasteFilter: filter,
            format_tags: 'p;h1;h2;h3;h4;h5;h6;pre',
            entities: false,
            toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'underline', 'strikethrough', 'subscript', 'superscript', 'horizontalline', 'insertTable', 'removeformat']
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

    ngOnChanges(changes: SimpleChanges): void {

        // resets values and validators in form controls when input displayValue or mode changes
        // at the first call of ngOnChanges, form control elements are not initialized yet
        this.resetFormControl();
    }

    ngOnDestroy(): void {
        this.unsubscribeFromValueChanges();
    }

    getNewValue(): CreateTextValueAsXml | false {

        if (this.mode !== 'create' || !this.form.valid) {
            return false;
        }

        const newTextValue = new CreateTextValueAsXml();

        newTextValue.xml = this.valueFormControl.value;

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

        updatedTextValue.xml = this.valueFormControl.value;

        if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
            updatedTextValue.valueHasComment = this.commentFormControl.value;
        }

        return updatedTextValue;
    }
}
