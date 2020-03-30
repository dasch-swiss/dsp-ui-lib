import {AfterViewInit, Component, Inject, Input, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {
  Constants,
  KnoraApiConnection,
  PermissionUtil,
  ReadResource,
  ReadValue,
  UpdateResource,
  UpdateValue,
  WriteValueResponse,
  DeleteValue,
  DeleteValueResponse
} from '@knora/api';
import {BaseValueComponent} from '../../values';
import {mergeMap} from 'rxjs/operators';
import {KnoraApiConnectionToken} from '../../../core';


@Component({
  selector: 'kui-display-edit',
  templateUrl: './display-edit.component.html',
  styleUrls: ['./display-edit.component.scss']
})
export class DisplayEditComponent implements OnInit {

  @ViewChild('displayVal', {static: false}) displayValueComponent: BaseValueComponent;

  @Input() displayValue: ReadValue;

  @Input() parentResource: ReadResource;

  @Input() configuration?: object;

  constants = Constants;

  mode: 'read' | 'update' | 'create' | 'search';

  canModify: boolean;

  editModeActive = false;

  constructor(@Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection) {
  }

  ngOnInit() {

    this.mode = 'read';

    // determine if user has modify permissions
    const allPermissions = PermissionUtil.allUserPermissions(this.displayValue.userHasPermission as 'RV' | 'V' | 'M' | 'D' | 'CR');

    this.canModify = allPermissions.indexOf(PermissionUtil.Permissions.M) !== -1;
    
  }

  activateEditMode() {
    this.editModeActive = true;
    this.mode = 'update';
  }

  saveEditValue() {
    console.log('edit displayValue: ', this.displayValue);
    this.editModeActive = false;
    const updatedVal = this.displayValueComponent.getUpdatedValue();

    if (updatedVal instanceof UpdateValue) {

      const updateRes = new UpdateResource();
      updateRes.id = this.parentResource.id;
      updateRes.type = this.parentResource.type;
      updateRes.property = this.displayValue.property;
      updateRes.value = updatedVal;
      this.knoraApiConnection.v2.values.updateValue(updateRes as UpdateResource<UpdateValue>).pipe(
        mergeMap((res: WriteValueResponse) => {
          return this.knoraApiConnection.v2.values.getValue(this.parentResource.id, res.uuid);
        })
      ).subscribe(
        (res2: ReadResource) => {
          this.displayValue = res2.getValues(this.displayValue.property)[0];
          this.mode = 'read';
        }
      );

    } else {
      console.error('invalid value');
    }
  }

  cancelEditValue() {
    this.editModeActive = false;
    this.mode = 'read';
  }

  deleteValue() {
    const deleteVal = new DeleteValue();
    deleteVal.id = this.displayValue.id;
    deleteVal.type = this.displayValue.type;

    const updateRes = new UpdateResource();
    updateRes.type = this.parentResource.type;
    updateRes.id = this.parentResource.id;
    updateRes.property = this.displayValue.property;
    updateRes.value = deleteVal;

    console.log('updateRes: ', updateRes);

    this.knoraApiConnection.v2.values.deleteValue(updateRes as UpdateResource<DeleteValue>).pipe(
      mergeMap((res: DeleteValueResponse) => {
        console.log('res: ', res);
        return res.result;
      })
    ).subscribe(
      () => {
        //console.log('res2: ', res2);
        //this.displayValue = res2.getValues(this.displayValue.property)[0];
        //this.mode = 'read';
      }
    );  
  }

}
