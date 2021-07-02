import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ReadResource } from '@dasch-swiss/dsp-js'
import { checkboxUpdate } from '../../list-view.component';

@Component({
  selector: 'dsp-resource-grid-content',
  templateUrl: './resource-grid-content.component.html',
  styleUrls: ['./resource-grid-content.component.css']
})
export class ResourceGridContentComponent {

  @Input() resource: ReadResource;

  /**
    * Set to true if multiple resources can be selected for comparison
    */
  @Input() withMultipleSelection?: boolean = false;

  /**
   * Resource index used for checkbox
   */
  @Input() resIndex?: number = 0;

  /**
   * Selected resource index list to apply style
   */
   @Input() selectedResourceIdx: number[];

  /**
   * When checkbox is clicked, event is returned with checkbox value and index
   */
  @Output() checkboxUpdated?: EventEmitter<checkboxUpdate> = new EventEmitter<checkboxUpdate>();

  constructor() { }

  /**
   * Emit the checkbox details
   *
   * @param checked boolean: checkbox value
   * @param resId number: resource index from list
   */
  viewResource(checked: boolean, resListIndex: number, resId: string) {
    this.checkboxUpdated.emit({ checked: checked, resListIndex: resListIndex, resId: resId});
  }

}
