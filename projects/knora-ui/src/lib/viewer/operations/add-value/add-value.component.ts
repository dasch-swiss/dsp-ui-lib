import { Component, OnInit, Inject, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { KnoraApiConnectionToken } from '../../../core/core.module';
import { KnoraApiConnection, ReadValue, ReadResource, Constants, PermissionUtil, CreateValue, UpdateResource, WriteValueResponse } from '@knora/api';
import { BaseValueComponent } from '../../values/base-value.component';
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

  @Input() resourceValues: ReadValue[];

  @Output() valueAdded = new EventEmitter();

  @Output() operationCancelled = new EventEmitter();

  constants = Constants;

  mode: 'read' | 'update' | 'create' | 'search';

  canModify: boolean;

  createModeActive = false;
  
  constructor(@Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection) { }

  ngOnInit() {
    this.mode = 'create';

    // determine if user has modify permissions
    const allPermissions = PermissionUtil.allUserPermissions(this.displayValue.userHasPermission as 'RV' | 'V' | 'M' | 'D' | 'CR');

    this.canModify = allPermissions.indexOf(PermissionUtil.Permissions.M) !== -1;

    this.createModeActive = true;

    this.resourceValues = this.parentResource.getValues('http://0.0.0.0:3333/ontology/0001/anything/v2#hasText');
  }

  saveAddValue() {
    this.createModeActive = false;
    const createVal = this.displayValueComponent.getNewValue();
    console.log('displayValueComponent: ', this.displayValueComponent);
    
    if (createVal instanceof CreateValue) {
      console.log('displayValue: ', this.displayValue);
      const updateRes = new UpdateResource();
      updateRes.id = this.parentResource.id;
      updateRes.type = this.parentResource.type;
      this.validValue(updateRes);

      // TODO: get the property name of the corresponding value type
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
            this.valueAdded.emit();
          }
        );
    } else {
      console.error('invalid value');
    }
  }

  cancelAddValue() {
    this.createModeActive = false;
    this.operationCancelled.emit();
  }

  validValue(updateResource: UpdateResource<CreateValue>): boolean {
    // get a list of all the property values
    // compare the value (text, url, etc.) of each property value with the new value
    // do not submit value if the value already exists
    // question: how to convert generic into type specific in order to check values?
    // question: where should this logic be done?

    console.log('updateResource: ', updateResource);
    
    this.resourceValues.forEach(function (value) {
      // if(value.text === updateResource.value){

      // }
    });
    return true;
  }
}
