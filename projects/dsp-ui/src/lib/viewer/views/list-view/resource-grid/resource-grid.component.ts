import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReadResourceSequence } from '@dasch-swiss/dsp-js';

@Component({
    selector: 'dsp-resource-grid',
    templateUrl: './resource-grid.component.html',
    styleUrls: ['./resource-grid.component.scss']
})
export class ResourceGridComponent {

    /**
     * List of resources of type ReadResourceSequence
     *
     * @param {ReadResourceSequence} resources
     */
    @Input() resources: ReadResourceSequence;

    @Input() selectedResourceIdx: number;

    /**
     * Click on an item will emit the resource iri
     *
     * @param {EventEmitter<object>} resourcesSelected
     */
    @Output() resourcesSelected: EventEmitter<object> = new EventEmitter<object>();

    selectedResourcesCount = 0;
    selectedResourcesList: string[] = [];

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
          this.selectedResourcesList.push(resId);

          // increase the count of selected resources
          this.selectedResourcesCount += 1;
        }
        else {
          // remove resource from the selected resources list
          let index = this.selectedResourcesList.findIndex(d => d === resId);
          this.selectedResourcesList.splice(index, 1);

          // decrease the count of selected resources
          this.selectedResourcesCount -= 1;
        }
        this.resourcesSelected.emit({resCount: this.selectedResourcesCount, resList: this.selectedResourcesList});
      }

}
