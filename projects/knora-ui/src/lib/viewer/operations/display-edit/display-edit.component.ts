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
  ReadTextValueAsXml,
  ReadTextValueAsHtml
} from '@knora/api';
import {BaseValueComponent} from '../../values/base-value.component';
import {mergeMap} from 'rxjs/operators';
import {KnoraApiConnectionToken} from '../../../core/core.module';

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

  shouldShowCommentToggle: boolean;
  
  // type of given displayValue
  // or knora-api-js-lib class representing the value
  valueTypeOrClass: string;

  // indicates if value can be edited
  readOnlyValue: boolean;

  private readonly readTextValueAsString = 'ReadTextValueAsString';

  private readonly readTextValueAsXml = 'ReadTextValueAsXml';

  private readonly readTextValueAsHtml = 'ReadTextValueAsHtml';

  constructor(@Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection) {
  }

  ngOnInit() {

    this.mode = 'read';

    // determine if user has modify permissions
    const allPermissions = PermissionUtil.allUserPermissions(this.displayValue.userHasPermission as 'RV' | 'V' | 'M' | 'D' | 'CR');

    this.canModify = allPermissions.indexOf(PermissionUtil.Permissions.M) !== -1;

    // check if comment toggle button should be shown
    this.checkCommentToggleVisibility();

    this.valueTypeOrClass = this.getValueTypeOrClass(this.displayValue);

    this.readOnlyValue = this.isReadOnly(this.valueTypeOrClass);
  }

  activateEditMode() {
    this.editModeActive = true;
    this.mode = 'update';

    // hide comment toggle button while in edit mode
    this.checkCommentToggleVisibility();
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

          // hide comment once back in read mode
          this.displayValueComponent.updateCommentVisibility();

          // check if comment toggle button should be shown
          this.checkCommentToggleVisibility();
        }
      );

    } else {
      console.error('invalid value');
    }
  }

  cancelEditValue() {
    this.editModeActive = false;
    this.mode = 'read';

    // hide comment once back in read mode
    this.displayValueComponent.updateCommentVisibility();

    // check if comment toggle button should be shown
    this.checkCommentToggleVisibility();
  }

  // shows or hides the comment
  toggleComment() {
    this.displayValueComponent.toggleCommentVisibility();
  }

  // only show the comment toggle button if user is in READ mode and a comment exists for the value
  checkCommentToggleVisibility() {
    this.shouldShowCommentToggle = (this.mode === 'read' && this.displayValue.valueHasComment !== '' && this.displayValue.valueHasComment !== undefined);
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
        return this.readTextValueAsString;
      } else if (value instanceof ReadTextValueAsXml) {
        return this.readTextValueAsXml;
      } else if (value instanceof ReadTextValueAsHtml) {
        return this.readTextValueAsHtml;
      } else {
        throw new Error(`unknown TextValue class ${value}`);
      }
    } else {
      return value.type;
    }
  }

  /**
   * Equality checks with constants below are TEMPORARY until component is implemented.
   * Used so that the CRUD buttons do not show if a property doesn't have a value component.
   */

  /**
   * Determines if the given value is readonly.
   *
   * @param valueTypeOrClass the type or class of the given value.
   */
  isReadOnly(valueTypeOrClass: string): boolean {
    return valueTypeOrClass === this.readTextValueAsHtml ||
           valueTypeOrClass === this.readTextValueAsXml  ||
           valueTypeOrClass === this.constants.DateValue ||
           valueTypeOrClass === this.constants.GeomValue ||
           valueTypeOrClass === this.constants.GeonameValue;
  }
}
