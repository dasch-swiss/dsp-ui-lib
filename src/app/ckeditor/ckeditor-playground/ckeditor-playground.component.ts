import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { TextValueAsXMLComponent } from '@dasch-swiss/dsp-ui/lib/viewer/values/text-value/text-value-as-xml/text-value-as-xml.component';
import { KnoraApiConnection, ReadResource, ReadTextValueAsXml } from '@dasch-swiss/dsp-js';
import { DspApiConnectionToken } from '@dasch-swiss/dsp-ui';

@Component({
    selector: 'app-ckeditor-playground',
    templateUrl: './ckeditor-playground.component.html',
    styleUrls: ['./ckeditor-playground.component.scss']
})
export class CkeditorPlaygroundComponent implements OnInit {

    @ViewChild('xml') xmlValue: TextValueAsXMLComponent;

    displayVal: ReadTextValueAsXml;

    mode: 'read' | 'update';

    loading = true;

    constructor(@Inject(DspApiConnectionToken) private _dspApiConnection: KnoraApiConnection) {
    }

    ngOnInit(): void {

        // http://rdfh.ch/0001/qN1igiDRSAemBBktbRHn6g
        // http://rdfh.ch/0001/thing_with_richtext_with_markup

        this._dspApiConnection.v2.res.getResource('http://rdfh.ch/0001/qN1igiDRSAemBBktbRHn6g').subscribe(
            (res: ReadResource) => {

                this.mode = 'read';

                this.displayVal = res.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasRichtext', ReadTextValueAsXml)[0];

                this.loading = false;
            },
            err => console.error(err)
        );
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
