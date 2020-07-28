import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { TextValueAsXMLComponent } from '@dasch-swiss/dsp-ui/lib/viewer/values/text-value/text-value-as-xml/text-value-as-xml.component';
import {
    KnoraApiConnection,
    ReadResource,
    ReadTextValueAsXml,
    UpdateResource, UpdateTextValueAsXml,
    UpdateValue,
    WriteValueResponse
} from '@dasch-swiss/dsp-js';
import { DspApiConnectionToken } from '@dasch-swiss/dsp-ui';
import { mergeMap } from 'rxjs/operators';

@Component({
    selector: 'app-ckeditor-playground',
    templateUrl: './ckeditor-playground.component.html',
    styleUrls: ['./ckeditor-playground.component.scss']
})
export class CkeditorPlaygroundComponent implements OnInit {

    @ViewChild('xml') xmlValue: TextValueAsXMLComponent;

    resource: ReadResource;
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

                this.resource = res;

                this.mode = 'read';

                this.displayVal = res.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasRichtext', ReadTextValueAsXml)[0];

                // console.log(res.entityInfo.properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasRichtext']);

                this.loading = false;
            },
            err => console.error(err)
        );
    }

    save() {

        const updatedVal = this.xmlValue.getUpdatedValue();

        if (updatedVal !== false) {

            console.log(updatedVal.xml);

            const updateRes = new UpdateResource();
            updateRes.id = this.resource.id;
            updateRes.type = this.resource.type;
            updateRes.property = this.displayVal.property;
            updateRes.value = updatedVal;

            this._dspApiConnection.v2.values.updateValue(updateRes as UpdateResource<UpdateValue>).pipe(
                mergeMap((res: WriteValueResponse) => {
                    return this._dspApiConnection.v2.values.getValue(this.resource.id, res.uuid);
                })
            ).subscribe(
                (res2: ReadResource) => {
                    this.displayVal = res2.getValues(this.displayVal.property)[0] as ReadTextValueAsXml;
                    this.mode = 'read';
                }
            );

        }
    }

    toggleMode() {
        if (this.mode === 'read') {
            this.mode = 'update';
        } else {
            this.mode = 'read';
        }
    }

}
