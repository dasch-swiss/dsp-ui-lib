import { Component, OnInit } from '@angular/core';
import * as Editor from 'ckeditor5-custom-build';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'dsp-ckeditor-playground',
    templateUrl: './ckeditor-playground.component.html',
    styleUrls: ['./ckeditor-playground.component.scss']
})
export class CkeditorPlaygroundComponent implements OnInit {

    public Editor = Editor;

    filter = ' p em strong strike u sub sup hr h1 h2 h3 h4 h5 h6 pre table tbody tr td ol ul li cite blockquote code; a[!href](salsah-link) ';

    editorConfig = {
        allowedContent: this.filter,
        pasteFilter: this.filter,
        format_tags: 'p;h1;h2;h3;h4;h5;h6;pre',
        entities: false,
        toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'underline', 'strikethrough', 'subscript', 'superscript', 'horizontalline', 'insertTable', 'removeformat' ]/*,
        toolbar: [
            { name: 'basicstyles', items: [ 'Format', 'Bold', 'Italic', 'Strike', 'Underline', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
            { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Blockquote' ] },
            { name: 'links', items: [ 'Link', 'Unlink' ] },
            { name: 'insert', items: [ 'Table', 'HorizontalRule'] },
            { name: 'tools', items: [ 'Maximize' ] }
        ]*/
    };

    constructor(private fb: FormBuilder) {
    }

    form: FormGroup;
    value: FormControl;

    ngOnInit(): void {

        this.value = new FormControl('');
        this.form = this.fb.group({
            text: this.value
        });

        this.value.valueChanges.subscribe(
            data => console.log(data)
        );

    }

}
