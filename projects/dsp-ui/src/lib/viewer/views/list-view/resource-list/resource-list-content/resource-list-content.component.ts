import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReadResource } from '@dasch-swiss/dsp-js'
import { checkboxUpdate } from '../resource-list.component';

@Component({
  selector: 'dsp-resource-list-content',
  templateUrl: './resource-list-content.component.html',
  styleUrls: ['./resource-list-content.component.css']
})
export class ResourceListContentComponent {

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
  viewResource(checked: boolean, resId: number) {
      this.checkboxUpdated.emit({ checked: checked, resIndex: resId.toString()});
  }

}
