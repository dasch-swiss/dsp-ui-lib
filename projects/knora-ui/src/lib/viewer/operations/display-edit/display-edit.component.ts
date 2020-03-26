import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {
  Constants,
  KnoraApiConnection,
  PermissionUtil,
  ReadResource,
  ReadValue,
  UpdateResource,
  UpdateValue,
  WriteValueResponse,
  ReadTextValueAsString,
  ReadTextValueAsXml
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

  valueType: string;

  constructor(@Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection) {
  }

  ngOnInit() {

    this.mode = 'read';

    // determine if user has modify permissions
    const allPermissions = PermissionUtil.allUserPermissions(this.displayValue.userHasPermission as 'RV' | 'V' | 'M' | 'D' | 'CR');

    this.canModify = allPermissions.indexOf(PermissionUtil.Permissions.M) !== -1;

    this.valueType = this.getValueType();
  }

  activateEditMode() {
    this.editModeActive = true;
    this.mode = 'update';
  }

  saveEditValue() {
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

  getValueType(): string | null{
    if (this.displayValue.type === this.constants.TextValue) {

      if (this.displayValue instanceof ReadTextValueAsString) {
        this.valueType = 'ReadTextValueAsString';
      } else if (this.displayValue instanceof ReadTextValueAsXml) {
        this.valueType = 'ReadTextValueAsXml';
      } else {
        this.valueType = 'ReadTextValueAsHtml';
      }

    } else {
      this.valueType = this.displayValue.type;
    }

    return this.valueType;
  }
}
