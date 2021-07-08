import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dsp-selected-resources',
  templateUrl: './selected-resources.component.html',
  styleUrls: ['./selected-resources.component.scss']
})
export class SelectedResourcesComponent implements OnInit {

  // total number of resources selected
  @Input() resCount: number;

  // list of selected resources ids
  @Input() resIds: string[];

  constructor() { }

  ngOnInit(): void {
  }

}
