import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReadResourceSequence } from '@dasch-swiss/dsp-js';

@Component({
    selector: 'dsp-resource-list',
    templateUrl: './resource-list.component.html',
    styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent {

    /**
      * List of resources of type ReadResourceSequence
      *
      * @param  {ReadResourceSequence} resources
      */
    @Input() resources: ReadResourceSequence;

    /**
     * Click on an item will emit the resource iri
     *
     * @param  {EventEmitter<string>} resourceSelected
     */
    @Output() resourceSelected: EventEmitter<string> = new EventEmitter<string>();

    constructor() { }

}
