import { Component, Input } from '@angular/core';
import { ReadResource } from '@dasch-swiss/dsp-js'

@Component({
  selector: 'dsp-resource-list-content',
  templateUrl: './resource-list-content.component.html',
  styleUrls: ['./resource-list-content.component.css']
})
export class ResourceListContentComponent {

  @Input() resource: ReadResource;

  constructor() { }

}
