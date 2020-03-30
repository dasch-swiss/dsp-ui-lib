import { Component, OnInit, Inject, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { KnoraApiConnectionToken } from '../../../core';
import { KnoraApiConnection, ReadValue, ReadResource, Constants, PermissionUtil, CreateValue, UpdateResource, WriteValueResponse } from '@knora/api';
import { BaseValueComponent } from '../../values';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'kui-add-value',
  templateUrl: './add-value.component.html',
  styleUrls: ['./add-value.component.scss']
})
export class AddValueComponent implements OnInit {

  @ViewChild('displayVal', {static: false}) displayValueComponent: BaseValueComponent;

  @Input() displayValue: ReadValue;

  @Input() parentResource: ReadResource;

  @Input() configuration?: object;

  @Output() valueAdded = new EventEmitter<boolean>();

  @Output() operationCancelled = new EventEmitter<boolean>();

  constants = Constants;

  mode: 'read' | 'update' | 'create' | 'search';

  canModify: boolean;

  editModeActive = false;
  
  constructor(@Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection) { }

  ngOnInit() {
    this.mode = 'create';

    // determine if user has modify permissions
    const allPermissions = PermissionUtil.allUserPermissions(this.displayValue.userHasPermission as 'RV' | 'V' | 'M' | 'D' | 'CR');

    this.canModify = allPermissions.indexOf(PermissionUtil.Permissions.M) !== -1;

    this.editModeActive = true;
  }

  saveAddValue() {
    this.editModeActive = false;
    const createVal = this.displayValueComponent.getNewValue();
    // console.log('createVal: ', createVal);
    
    if (createVal instanceof CreateValue) {
      // console.log('create displayValue: ', this.displayValue);
      
      const updateRes = new UpdateResource();
      updateRes.id = this.parentResource.id;
      updateRes.type = this.parentResource.type;
      updateRes.property = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText';
      updateRes.value = createVal;

      // console.log('updateRes: ', updateRes);
      
      this.knoraApiConnection.v2.values.createValue(updateRes as UpdateResource<CreateValue>).pipe(
        mergeMap((res: WriteValueResponse) => {
          // console.log(res);
          return this.knoraApiConnection.v2.values.getValue(this.parentResource.id, res.uuid);
        })
        ).subscribe(
          (res2: ReadResource) => {
            // console.log(this.parentResource);
            this.mode = 'read';
            
            this.valueAdded.emit(true);
          }
        );

    } else {
      console.error('invalid value');
    }
  }

  cancelAddValue() {
    this.editModeActive = false;
    this.mode = 'read';
    this.operationCancelled.emit(true);
  }
}
