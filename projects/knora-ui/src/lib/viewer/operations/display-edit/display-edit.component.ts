import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Constants, ReadValue} from '@knora/api';
import {BaseValueComponent} from '../../values';

@Component({
  selector: 'lib-display-edit',
  templateUrl: './display-edit.component.html',
  styleUrls: ['./display-edit.component.scss']
})
export class DisplayEditComponent implements OnInit {

  @ViewChild('displayValue', {static: false}) displayValueComponent: BaseValueComponent;

  @Input() displayValue: ReadValue;

  @Input() configuration?: object;

  constants = Constants;

  mode: 'read' | 'update' | 'create' | 'search';

  constructor() {
  }

  ngOnInit() {
    this.mode = 'read';
  }

}
