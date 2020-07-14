import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReadResourceSequence } from '@dasch-swiss/dsp-js';

@Component({
  selector: 'dsp-resource-grid',
  templateUrl: './resource-grid.component.html',
  styleUrls: ['./resource-grid.component.scss']
})
export class ResourceGridComponent implements OnInit {

    /**
     * List of resources of type ReadResourceSequence
     *
     * @param resources
     */
     @Input() resources: ReadResourceSequence;

     /**
      * Click on an item will emit the resource iri
      *
      * @param resourceSelected
      */
     @Output() resourceSelected: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

}
