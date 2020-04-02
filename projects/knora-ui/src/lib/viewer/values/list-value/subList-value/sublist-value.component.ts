import {Component, Input, Output, EventEmitter, ViewChild, OnInit} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ListNodeV2 } from '@knora/api';

@Component({
  selector: 'kui-sublist-value',
  templateUrl: './sublist-value.component.html',
  styleUrls: ['./sublist-value.component.scss']
})
export class SublistValueComponent {

  @Input() children: ListNodeV2[];

  @Output() selectedNode: EventEmitter<ListNodeV2> = new EventEmitter<ListNodeV2>();

  @ViewChild('childMenu', { static: true }) public childMenu: MatMenuTrigger;
  constructor() {
  }
  setValue(item: ListNodeV2) {
    this.selectedNode.emit(item);
  }

}
