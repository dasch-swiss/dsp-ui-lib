import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {
    Constants,
    CreateValue,
    KnoraApiConnection,
    PermissionUtil,
    ReadResource,
    ReadValue,
    UpdateResource,
    WriteValueResponse
} from '@dasch-swiss/dsp-js';
import { mergeMap } from 'rxjs/operators';
import { DspApiConnectionToken } from '../../../core/core.module';
import { EmitEvent, EventBusService, Events } from '../../services/event-bus.service';
import { BaseValueComponent } from '../../values/base-value.component';

@Component({
  selector: 'dsp-add-value',
  templateUrl: './add-value.component.html',
  styleUrls: ['./add-value.component.scss']
})
export class AddValueComponent implements OnInit {

    @ViewChild('displayVal', {static: false}) displayValueComponent: BaseValueComponent;

    @Input() displayValue: ReadValue;

    @Input() parentResource: ReadResource;

    @Input() configuration?: object;

    @Input() resourceValues: ReadValue[];

    @Output() operationCancelled = new EventEmitter<any>();

    constants = Constants;

    mode: 'read' | 'update' | 'create' | 'search';

    canModify: boolean;

    createModeActive = false;

    constructor(@Inject(DspApiConnectionToken)
                private knoraApiConnection: KnoraApiConnection,
                private eventBusService: EventBusService) { }

    ngOnInit() {
        this.mode = 'create';

        // determine if user has modify permissions
        const allPermissions = PermissionUtil.allUserPermissions(this.displayValue.userHasPermission as 'RV' | 'V' | 'M' | 'D' | 'CR');

        this.canModify = allPermissions.indexOf(PermissionUtil.Permissions.M) !== -1;

        this.createModeActive = true;

        // this.resourceValues = this.parentResource.getValues('http://0.0.0.0:3333/ontology/0001/anything/v2#hasText');
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

            // TODO: get the property name of the corresponding value type
            updateRes.property = this.displayValue.id;
            // updateRes.property = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText';
            updateRes.value = createVal;

            console.log('updateRes: ', updateRes);

            this.knoraApiConnection.v2.values.createValue(updateRes as UpdateResource<CreateValue>).pipe(
                mergeMap((res: WriteValueResponse) => {
                    // console.log(res);
                    return this.knoraApiConnection.v2.values.getValue(this.parentResource.id, res.uuid);
                })
                ).subscribe(
                    (res2: ReadResource) => {
                    // console.log(this.parentResource);
                    // this.valueAdded.emit(null);
                    this.eventBusService.emit(new EmitEvent(Events.ValueAdded));
                    }
                );
            } else {
                console.error('invalid value');
            }
    }

    cancelAddValue() {
        this.createModeActive = false;
        this.operationCancelled.emit(null);
    }

}
