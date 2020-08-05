import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import {
    Constants,









    DeleteValue,
    DeleteValueResponse, KnoraApiConnection,
    PermissionUtil,
    ReadResource,
    ReadValue,
    UpdateResource,
    UpdateValue,
    WriteValueResponse
} from '@dasch-swiss/dsp-js';
import { mergeMap } from 'rxjs/operators';
import { DspApiConnectionToken } from '../../../core/core.module';
import { EmitEvent, Events, ValueOperationEventService } from '../../services/value-operation-event.service';
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

    constructor(
        @Inject(DspApiConnectionToken) private _dspApiConnection: KnoraApiConnection,
        private _valueOperationEventService: ValueOperationEventService,
        private _valueTypeService: ValueTypeService) {
    }

    ngOnInit() {

        this.mode = 'read';

        // determine if user has modify permissions
        const allPermissions = PermissionUtil.allUserPermissions(this.displayValue.userHasPermission as 'RV' | 'V' | 'M' | 'D' | 'CR');

        this.canModify = allPermissions.indexOf(PermissionUtil.Permissions.M) !== -1;

        // check if comment toggle button should be shown
        this.checkCommentToggleVisibility();

        this.valueTypeOrClass = this._valueTypeService.getValueTypeOrClass(this.displayValue);

        this.readOnlyValue = this._valueTypeService.isReadOnly(this.valueTypeOrClass);
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
            this._dspApiConnection.v2.values.updateValue(updateRes as UpdateResource<UpdateValue>).pipe(
                mergeMap((res: WriteValueResponse) => {
                    return this._dspApiConnection.v2.values.getValue(this.parentResource.id, res.uuid);
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

        this._dspApiConnection.v2.values.deleteValue(updateRes as UpdateResource<DeleteValue>).pipe(
        mergeMap((res: DeleteValueResponse) => {
            console.log('res: ', res);
            // emit a ValueDeleted event to the listeners in resource-view component to trigger an update of the UI
            this._valueOperationEventService.emit(new EmitEvent(Events.ValueDeleted, deleteVal));
            return res.result;
        })
        ).subscribe(
        () => {
            // TODO: figure out what needs to be done here
        }
        );
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
        this.shouldShowCommentToggle = (
            this.mode === 'read' &&
            this.displayValue.valueHasComment !== '' &&
            this.displayValue.valueHasComment !== undefined
        );
    }

}
