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

    @Input() selectedResourceIdx: number;

    /**
     * Click on an item will emit the resource iri
     *
     * @param  {EventEmitter<string>} resourceSelected
     */
    @Output() resourceSelected: EventEmitter<string> = new EventEmitter<string>();

    selectedResourcesCount = 0;
    selectedResources: string[] = [];

    constructor() { }

    /**
     * Maintain the list and count of selected resources
     *
     * @param {boolean} checked tells if checkbox is selected
     * @param {string} resId resource id
     */
    viewResourse(checked: boolean, resId: string) {
      if (checked) {
        // add resource in to the selected resources list
        this.selectedResources.push(resId);

        // increase the count of selected resources
        this.selectedResourcesCount += 1;
      }
      else {
        // remove resource from the selected resources list
        let index = this.selectedResources.findIndex(d => d === resId);
        this.selectedResources.splice(index, 1);

        // decrease the count of selected resources
        this.selectedResourcesCount -= 1;
      }
      alert(this.selectedResourcesCount + " resources are selected.");
      console.log(this.selectedResources);
    }

}
