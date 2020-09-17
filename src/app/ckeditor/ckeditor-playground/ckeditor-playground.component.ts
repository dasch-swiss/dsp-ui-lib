import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
    KnoraApiConnection,
    ReadResource,
    ReadTextValueAsXml,
    UpdateResource,
    UpdateValue,
    WriteValueResponse
} from '@dasch-swiss/dsp-js';
import { DspApiConnectionToken } from '@dasch-swiss/dsp-ui';
import { TextValueAsXMLComponent } from '@dasch-swiss/dsp-ui';
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

        this._dspApiConnection.v2.auth.login('username', 'root', 'test').pipe(
            mergeMap(() =>
                this._dspApiConnection.v2.res.getResource('http://rdfh.ch/0001/qN1igiDRSAemBBktbRHn6g')
            )).subscribe((res: ReadResource) => {

                this.resource = res;

                this.mode = 'read';

                this.displayVal = res.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasRichtext', ReadTextValueAsXml)[0];

                // console.log(res.entityInfo.properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasRichtext']);

                this.loading = false;
            },
            err => console.error(err)
        );
    }

    getXML() {
        console.log(this.xmlValue.valueFormControl.value);

        const update = this.xmlValue.getUpdatedValue();
        if (update) {
            console.log(update.mapping, update.xml);
        } else {
            console.log('invalid update val');
        }
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

        } else {
            console.log('identical, no update performed');
        }
    }

    toggleMode() {
        if (this.mode === 'read') {
            this.mode = 'update';
        } else {
            this.mode = 'read';
        }
    }

    sampleText() {

        const xml = `
                    <p>
        This is very boring text that as boring markup as well: <strong>strong</strong>, <strike>struck</strike>, <em>emphasized</em>, <u>underlined</u>,
        <sub>subtext</sub>m <sup>supertext</sup>, <a href="http://www.knora.org">KNORA</a>, <a class="salsah-link" href="http://rdfh.ch/0001/7uuGcnFcQJq08dMOralyCQ">internal link</a>,
    </p>

    <h1>header 1</h1>
    <h2>header 2</h2>
    <h3>header 3</h3>
    <h4>header 4</h4>
    <h5>header 5</h5>
    <h6>header 6</h6>

    <ul>
        <li>unordered list element</li>
        <li>unordered list element</li>
    </ul>

    <ol>
        <li>ordered list element</li>
        <li>ordered list element</li>
    </ol>

    <table>
        <tr>
            <td>year</td>
            <td>name</td>
        </tr>
        <tr>
            <td>2012</td>
            <td>Old Ideas</td>
        </tr>
        <tr>
            <td>2014</td>
            <td>Polpular Problems</td>
        </tr>
    </table>

    <pre>
    He will speak these words of wisdom
      Like a sage, a man of vision
        Though he knows he’s really nothing
          But the brief elaboration of a tube
    </pre>

    <hr/>

    <blockquote>
        Digital data created during research that might be valuable for other ongoing or future research projects can be transfered to the DaSCH infrastructre. The DaSCH will preserve the data and provide long-term access.
    </blockquote>

    <code>
        ,= ,-_-. =.
       ((_/)o o(\\_))
        \`-'(. .)\`-'
            \\_/
    </code>
    <cite>GNU</cite>&#160;<em>Copyright © 2004, Martin Dickopp</em>
                `;

        const sampleText = new ReadTextValueAsXml();

        for (const key in this.displayVal) {
            if (this.displayVal.hasOwnProperty(key)) {
                sampleText[key] = this.displayVal[key];
            }
        }

        sampleText.xml = xml;

        this.displayVal = sampleText;

    }

}
