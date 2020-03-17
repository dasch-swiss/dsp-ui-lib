import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DisplayEditComponent } from '../../operations/display-edit/display-edit.component';
import { PropertyInfoValues } from '../resource-view/resource-view.component';
import { ReadResource } from '@knora/api';

@Component({
  selector: 'kui-property-view',
  templateUrl: './property-view.component.html',
  styleUrls: ['./property-view.component.scss']
})
export class PropertyViewComponent implements OnInit {

  @ViewChild('displayEdit', { static: false }) displayEditComponent: DisplayEditComponent;

  /**
   * Parent resource
   *
   * @param (resource)
   */
  @Input() resource: ReadResource;

  /**
   * Array of property object with ontology class prop def, list of properties and corresponding values
   *
   * @param (propArray)
   */
  @Input() propArray: PropertyInfoValues;

  constructor() { }

  ngOnInit() {

  }

}
