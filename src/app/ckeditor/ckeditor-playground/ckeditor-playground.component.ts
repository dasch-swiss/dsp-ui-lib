import { Component, OnInit, ViewChild } from '@angular/core';
import { TextValueAsXMLComponent } from '@dasch-swiss/dsp-ui/lib/viewer/values/text-value/text-value-as-xml/text-value-as-xml.component';

@Component({
    selector: 'app-ckeditor-playground',
    templateUrl: './ckeditor-playground.component.html',
    styleUrls: ['./ckeditor-playground.component.scss']
})
export class CkeditorPlaygroundComponent implements OnInit {

    @ViewChild('xml') xmlValue: TextValueAsXMLComponent;

    constructor() {
    }

    ngOnInit(): void {

    }

    save() {
        console.log(this.xmlValue.getNewValue());
    }

}
