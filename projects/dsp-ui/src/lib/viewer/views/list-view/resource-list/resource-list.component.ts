import { Component, EventEmitter, Input, Output, ViewChildren } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { ReadResourceSequence } from '@dasch-swiss/dsp-js';
import { FilteredResouces, checkboxUpdate } from '../list-view.component';

@Component({
    selector: 'dsp-resource-list',
    templateUrl: './resource-list.component.html',
    styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent {

    /**
     * List of all resource checkboxes. This list is used to
     * unselect all checkboxes when single selection to view
     * resource is used
     */
    @ViewChildren("ckbox") resChecks: MatCheckbox[];

    /**
      * List of resources of type ReadResourceSequence
      *
      * @param  {ReadResourceSequence} resources
      */
    @Input() resources: ReadResourceSequence;

    /**
     * List of all selected resources indices
     */
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

    // for keeping track of multiple selection
    selectedResourcesCount = 0;
    selectedResourcesList = [];
    selectedResourceIdxMultiple = [];

    constructor() { }

    /**
     * Maintain the list and count of selected resources
     *
     * @param {checkboxUpdate} checkbox value and resource index
     */
    viewResource(status: checkboxUpdate) {

      // when multiple selection and checkbox is used to select more
      // than one resources
      if (this.withMultipleSelection && status.isCheckbox) {
          if (status.checked) {
            if(this.selectedResourceIdx.indexOf(status.resListIndex) < 0) {
              // add resource in to the selected resources list
              this.selectedResourcesList.push(status.resId);

              // increase the count of selected resources
              this.selectedResourcesCount += 1;

              // add resource list index to apply selected class style
              this.selectedResourceIdxMultiple.push(status.resListIndex);
            }
          }
          else {
            // remove resource from the selected resources list
            let index = this.selectedResourcesList.findIndex(d => d === status.resId);
            this.selectedResourcesList.splice(index, 1);

            // decrease the count of selected resources
            this.selectedResourcesCount -= 1;

            // remove resource list index from the selected index list
            index = this.selectedResourceIdxMultiple.findIndex(d => d === status.resListIndex);
            this.selectedResourceIdxMultiple.splice(index, 1);
          }
        this.selectedResourceIdx = this.selectedResourceIdxMultiple;
        this.resourcesSelected.emit({count: this.selectedResourcesCount, resListIndex: this.selectedResourceIdx, resIds: this.selectedResourcesList, selectionType: "multiple"});

      } else {
        // else condition when single resource is clicked for viewing

        // unselect checkboxes if any
        this.resChecks.forEach(function(ckb){
          if(ckb.checked) {
            ckb.checked = false;
          }
        });

        // reset all the variables for multiple selection
        this.selectedResourceIdxMultiple = [];
        this.selectedResourcesCount = 0;
        this.selectedResourcesList = [];

        // add resource list index to apply selected class style
        this.selectedResourceIdx = [status.resListIndex];
        this.resourcesSelected.emit({count: 1, resListIndex: this.selectedResourceIdx, resIds: [status.resId], selectionType: "single"});
    }
  }
}
