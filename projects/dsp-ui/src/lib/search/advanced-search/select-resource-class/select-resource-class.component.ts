import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResourceClassDefinition } from '@knora/api';

@Component({
    selector: 'dsp-select-resource-class',
    templateUrl: './select-resource-class.component.html',
    styleUrls: ['./select-resource-class.component.scss']
})
export class SelectResourceClassComponent implements OnInit, OnChanges {

    @Input() formGroup: FormGroup;

    @Input() resourceClasses: ResourceClassDefinition[];

    @Output() resourceClassSelected = new EventEmitter<string>();

    // stores the currently selected resource class
    private _resourceClassSelected: string;

    form: FormGroup;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges) {
    }

}
