import { Injectable } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { CheckboxUpdate, FilteredResouces } from './list-view.component';

@Injectable({
    providedIn: 'root'
})
export class ListViewService {

    // for keeping track of multiple selection
    selectedResourcesCount = 0;
    selectedResourcesList = [];
    selectedResourceIdxMultiple = [];

    constructor() { }

    viewResource(status: CheckboxUpdate, withMultipleSelection: boolean, selectedResourceIdx: number [], resChecks: MatCheckbox[]): FilteredResouces {

        // when multiple selection and checkbox is used to select more
        // than one resources
        if (withMultipleSelection && status.isCheckbox) {

            if (status.checked) {
                if (selectedResourceIdx.indexOf(status.resListIndex) <= 0) {
                    // add resource in to the selected resources list
                    this.selectedResourcesList.push(status.resId);

                    // increase the count of selected resources
                    this.selectedResourcesCount += 1;

                    // add resource list index to apply selected class style
                    this.selectedResourceIdxMultiple.push(status.resListIndex);
                }
            } else {
                // remove resource from the selected resources list
                let index = this.selectedResourcesList.findIndex(d => d === status.resId);
                this.selectedResourcesList.splice(index, 1);

                // decrease the count of selected resources
                this.selectedResourcesCount -= 1;

                // remove resource list index from the selected index list
                index = this.selectedResourceIdxMultiple.findIndex(d => d === status.resListIndex);
                this.selectedResourceIdxMultiple.splice(index, 1);
            }
            // selectedResourceIdx = selectedResourceIdxMultiple;
            return { count: this.selectedResourcesCount, resListIndex: this.selectedResourceIdxMultiple, resIds: this.selectedResourcesList, selectionType: "multiple" };

        } else {
            // else condition when single resource is clicked for viewing

            // unselect checkboxes if any
            resChecks.forEach(function (ckb) {
                if (ckb.checked) {
                    ckb.checked = false;
                }
            });

            // reset all the variables for multiple selection
            this.selectedResourceIdxMultiple = [];
            this.selectedResourcesCount = 0;
            this.selectedResourcesList = [];

            // add resource list index to apply selected class style
            // selectedResourceIdx = [status.resListIndex];
            return { count: 1, resListIndex: [status.resListIndex], resIds: [status.resId], selectionType: "single" };
        }
    }
}
