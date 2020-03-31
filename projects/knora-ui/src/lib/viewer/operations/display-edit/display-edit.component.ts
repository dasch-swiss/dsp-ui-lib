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

  // type of given displayValue
  // or knora-api-js-lib class representing the value
  valueTypeOrClass: string;

  constructor(@Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection) {
  }

  ngOnInit() {

    this.mode = 'read';

    // determine if user has modify permissions
    const allPermissions = PermissionUtil.allUserPermissions(this.displayValue.userHasPermission as 'RV' | 'V' | 'M' | 'D' | 'CR');

    this.canModify = allPermissions.indexOf(PermissionUtil.Permissions.M) !== -1;

    this.valueTypeOrClass = this.getValueTypeOrClass(this.displayValue);
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

  /**
   * Given a value, determines the type or class representing it.
   *
   * For text values, this method determines the specific class in use.
   * For all other types, the given type is returned.
   *
   * @param value the given value.
   */
  getValueTypeOrClass(value: ReadValue): string {

    if (value.type === this.constants.TextValue) {
      if (value instanceof ReadTextValueAsString) {
        return 'ReadTextValueAsString';
      } else if (value instanceof ReadTextValueAsXml) {
        return 'ReadTextValueAsXml';
      } else {
        return 'ReadTextValueAsHtml';
      }
    } else {
      return value.type;
    }
  }
}
