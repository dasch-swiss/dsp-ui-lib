import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReadResourceSequence } from '@dasch-swiss/dsp-js';
import { FilteredResouces, checkboxUpdate } from '../list-view.component';



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

    @Input() selectedResourceIdx: number[];

    /**
      * Set to true if multiple resources can be selected for comparison
      */
    @Input() withMultipleSelection?: boolean = false;

    /**
     * Click on checkbox will emit the resource info
     *
     * @param  {EventEmitter<FilteredResouces>} resourcesSelected
     */
    @Output() resourcesSelected?: EventEmitter<FilteredResouces> = new EventEmitter<FilteredResouces>();

    @Output() checkboxUpdated?: EventEmitter<checkboxUpdate> = new EventEmitter<checkboxUpdate>();

    selectedResourcesCount = 0;
    selectedResourcesList = [];

    constructor() { }

    /**
     * Maintain the list and count of selected resources
     *
     * @param {checkboxUpdate} checkbox value and resource index
     */
    viewResource(status: checkboxUpdate) {
      if (this.withMultipleSelection) {
        if (status.checked) {
          // add resource in to the selected resources list
          this.selectedResourcesList.push(status.resId);

          // increase the count of selected resources
          this.selectedResourcesCount += 1;

          // add resource list index to apply selected class style
          this.selectedResourceIdx.push(status.resListIndex);
        }
        else {
          // remove resource from the selected resources list
          let index = this.selectedResourcesList.findIndex(d => d === status.resId);
          this.selectedResourcesList.splice(index, 1);

          // decrease the count of selected resources
          this.selectedResourcesCount -= 1;

          // remove resource list index from the selected index list
          index = this.selectedResourceIdx.findIndex(d => d === status.resListIndex);
          this.selectedResourceIdx.splice(index, 1);
        }

        this.resourcesSelected.emit({count: this.selectedResourcesCount, resListIndex: this.selectedResourceIdx, resIds: this.selectedResourcesList, selectionType: "multiple"});

      } else {

        // add resource list index to apply selected class style
        this.selectedResourceIdx = [status.resListIndex];
        this.resourcesSelected.emit({count: 1, resListIndex: this.selectedResourceIdx, resIds: [status.resId], selectionType: "single"});
    }
  }
}
