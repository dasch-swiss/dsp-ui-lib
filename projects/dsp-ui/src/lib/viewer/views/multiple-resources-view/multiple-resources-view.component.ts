import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dsp-multiple-resources-view',
  templateUrl: './multiple-resources-view.component.html',
  styleUrls: ['./multiple-resources-view.component.scss']
})
export class MultipleResourcesViewComponent implements OnInit {

  @Input() noOfResources: number;
  @Input() resourceIds: string[];

  topRow = [];
  bottomRow = [];

  constructor() { }

  ngOnInit(): void {
    // if number of resources are more than 3, divide it into 2 rows
    // otherwise display then in 1 row only
    if (this.noOfResources < 4) {
      this.topRow = this.resourceIds;
    }
    else {
      this.topRow = this.resourceIds.slice(0, this.noOfResources / 2);
      this.bottomRow = this.resourceIds.slice(this.noOfResources / 2)
    }
  }

}
