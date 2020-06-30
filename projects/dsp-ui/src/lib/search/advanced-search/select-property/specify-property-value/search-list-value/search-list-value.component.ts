import { Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IRI, PropertyValue, Value } from '../operator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    ApiResponseError,
    Constants,
    KnoraApiConnection,
    ListNodeV2,
    ResourcePropertyDefinition
} from '@dasch-swiss/dsp-js';
import { MatMenuTrigger } from '@angular/material/menu';
import { DspApiConnectionToken } from '../../../../../core';

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);

@Component({
  selector: 'dsp-search-list-value',
  templateUrl: './search-list-value.component.html',
  styleUrls: ['./search-list-value.component.scss']
})
export class SearchListValueComponent implements OnInit, OnDestroy, PropertyValue {

    // parent FormGroup
    @Input() formGroup: FormGroup;

    type = Constants.ListValue;

    form: FormGroup;

    @Input() property: ResourcePropertyDefinition;

    listRootNode: ListNodeV2;

    selectedNode: ListNodeV2;

    @ViewChild(MatMenuTrigger, { static: false }) menuTrigger: MatMenuTrigger;

    constructor(
        @Inject(DspApiConnectionToken) private knoraApiConnection: KnoraApiConnection,
        @Inject(FormBuilder) private fb: FormBuilder
    ) {
    }

    private getRootNodeIri(): string {
        const guiAttr = this.property.guiAttributes;

        if (guiAttr.length === 1 && guiAttr[0].startsWith('hlist=')) {
            const listNodeIri = guiAttr[0].substr(7, guiAttr[0].length - (1 + 7)); // hlist=<>, get also rid of <>
            return listNodeIri;
        } else {
            console.log('No root node Iri given for property');
        }
    }

    ngOnInit() {

        this.form = this.fb.group({
            listValue: [null, Validators.required]
        });

        resolvedPromise.then(() => {
            // add form to the parent form group
            this.formGroup.addControl('propValue', this.form);
        });

        const rootNodeIri = this.getRootNodeIri();

        this.knoraApiConnection.v2.list.getList(rootNodeIri).subscribe(
            (response: ListNodeV2) => {
                this.listRootNode = response;
            },
            (error: ApiResponseError) => {
                console.error(error);
            }
        );

    }

    ngOnDestroy() {

        // remove form from the parent form group
        resolvedPromise.then(() => {
            this.formGroup.removeControl('propValue');
        });

    }

    getValue(): Value {
        return new IRI(this.form.value.listValue);
    }

    getSelectedNode(item: ListNodeV2) {
        this.menuTrigger.closeMenu();
        this.selectedNode = item;

        this.form.controls['listValue'].setValue(item.id);
    }

}
