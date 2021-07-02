import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReadResourceSequence } from '@dasch-swiss/dsp-js';
import { FilteredResouces } from '../list-view.component';

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
      * Set to true if multiple resources can be selected for comparison
      */
    @Input() withMultipleSelection?: boolean = false;

    /**
     * Click on checkbox will emit the resource info
     *
     * @param  {EventEmitter<FilteredResouces>} multipleResourcesSelected
     */
    @Output() multipleResourcesSelected: EventEmitter<FilteredResouces> = new EventEmitter<FilteredResouces>();

    /**
     * Click on an item will emit the resource iri
     *
     * @param  {EventEmitter<string>} singleResourceSelected
     */
    @Output() singleResourceSelected: EventEmitter<string> = new EventEmitter<string>();

    selectedResourcesCount = 0;
    selectedResourcesList: string[] = [];

    constructor() { }

    /**
     * Maintain the list and count of selected resources
     *
     * @param {boolean} checked tells if checkbox is selected
     * @param {string} resId resource id
     */
    viewResource(checked: boolean, resId: string) {
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
      this.multipleResourcesSelected.emit({count: this.selectedResourcesCount, selectedIds: this.selectedResourcesList});
    }

}
