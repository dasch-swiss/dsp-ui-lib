import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import {
  Constants,
  DeleteValue,
  DeleteValueResponse,
  KnoraApiConnection,
  PermissionUtil,
  ReadResource,
  ReadValue,
  UpdateResource,
  UpdateValue,
  WriteValueResponse
} from '@dasch-swiss/dsp-js';
import { mergeMap } from 'rxjs/operators';
import { DspApiConnectionToken } from '../../../core/core.module';
import { EmitEvent, EventBusService, Events } from '../../services/event-bus.service';
import { ValueTypeService } from '../../services/value-type.service';
import { BaseValueComponent } from '../../values/base-value.component';

@Component({
  selector: 'dsp-display-edit',
  templateUrl: './display-edit.component.html',
  styleUrls: ['./display-edit.component.scss']
})
export class DisplayEditComponent implements OnInit {

    @ViewChild('displayVal') displayValueComponent: BaseValueComponent;

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

    constructor(@Inject(DspApiConnectionToken)
                private knoraApiConnection: KnoraApiConnection,
                private eventBusService: EventBusService,
                private valueTypeService: ValueTypeService) {
    }

    ngOnInit() {

        this.mode = 'read';

        // determine if user has modify permissions
        const allPermissions = PermissionUtil.allUserPermissions(this.displayValue.userHasPermission as 'RV' | 'V' | 'M' | 'D' | 'CR');

        this.canModify = allPermissions.indexOf(PermissionUtil.Permissions.M) !== -1;

        // check if comment toggle button should be shown
        this.checkCommentToggleVisibility();

        this.valueTypeOrClass = this.valueTypeService.getValueTypeOrClass(this.displayValue);

        this.readOnlyValue = this.valueTypeService.isReadOnly(this.valueTypeOrClass);
    }

    activateEditMode() {
        this.editModeActive = true;
        this.mode = 'update';

        // hide comment toggle button while in edit mode
        this.checkCommentToggleVisibility();

        // hide read mode comment when switching to edit mode
        this.displayValueComponent.shouldShowComment = false;
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
            this.eventBusService.emit(new EmitEvent(Events.ValueDeleted));
            return res.result;
          })
        ).subscribe(
          () => {
            // TODO: figure out what needs to be done here
          }
        );
      }

    // shows or hides the comment
    toggleComment() {
        this.displayValueComponent.toggleCommentVisibility();
    }

    // only show the comment toggle button if user is in READ mode and a comment exists for the value
    checkCommentToggleVisibility() {
        this.shouldShowCommentToggle = (this.mode === 'read' && this.displayValue.valueHasComment !== '' && this.displayValue.valueHasComment !== undefined);
    }

}
