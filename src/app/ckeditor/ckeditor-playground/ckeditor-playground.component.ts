import { Component, OnInit, ViewChild } from '@angular/core';
import { TextValueAsXMLComponent } from '@dasch-swiss/dsp-ui/lib/viewer/values/text-value/text-value-as-xml/text-value-as-xml.component';
import { ReadTextValueAsXml } from '@dasch-swiss/dsp-js';

@Component({
    selector: 'app-ckeditor-playground',
    templateUrl: './ckeditor-playground.component.html',
    styleUrls: ['./ckeditor-playground.component.scss']
})
export class CkeditorPlaygroundComponent implements OnInit {

    @ViewChild('xml') xmlValue: TextValueAsXMLComponent;

    displayVal: ReadTextValueAsXml;

    mode: 'read' | 'update';

    constructor() {
    }

    ngOnInit(): void {

        const inputVal = new ReadTextValueAsXml();
        inputVal.mapping = 'http://rdfh.ch/standoff/mappings/StandardMapping';
        inputVal.xml = '<html><p>my text</p></html>';

        this.mode = 'read';

        this.displayVal = inputVal;
    }

    save() {
        console.log(this.xmlValue.getUpdatedValue());
    }

    toggleMode() {
        if (this.mode === 'read') {
            this.mode = 'update';
        } else {
            this.mode = 'read';
        }
    }

}
