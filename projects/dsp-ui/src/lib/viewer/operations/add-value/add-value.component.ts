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
    ReadResource,
    ResourcePropertyDefinition,
    UpdateResource,
    WriteValueResponse,
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

    @ViewChild('createVal', {static: false}) createValueComponent: BaseValueComponent;

    @Input() resourcePropertyDefinition: ResourcePropertyDefinition;

    @Input() parentResource: ReadResource;

    @Input() configuration?: object;

    @Output() operationCancelled = new EventEmitter<any>();

    constants = Constants;

    mode: 'read' | 'update' | 'create' | 'search';

    canModify: boolean;

    createModeActive = false;

    submittingValue = false;

    progressIndicatorStatus = 0;

    progressIndicatorColor = 'blue';

    constructor(@Inject(DspApiConnectionToken)
                private knoraApiConnection: KnoraApiConnection,
                private eventBusService: EventBusService) { }

    ngOnInit() {

        this.mode = 'create';

        this.createModeActive = true;

        // TODO: find a way to figure out what type of text value it is
        if (this.resourcePropertyDefinition.objectType === 'http://api.knora.org/ontology/knora-api/v2#TextValue') {
            this.resourcePropertyDefinition.objectType = 'ReadTextValueAsString';
        }
    }

    saveAddValue() {
        this.createModeActive = false;
        this.submittingValue = true;
        const createVal = this.createValueComponent.getNewValue();

        if (createVal instanceof CreateValue) {
            const updateRes = new UpdateResource();
            updateRes.id = this.parentResource.id;
            updateRes.type = this.parentResource.type;
            updateRes.property = this.resourcePropertyDefinition.id;
            updateRes.value = createVal;

            this.knoraApiConnection.v2.values.createValue(updateRes as UpdateResource<CreateValue>).pipe(
                mergeMap((res: WriteValueResponse) => {
                    return this.knoraApiConnection.v2.values.getValue(this.parentResource.id, res.uuid);
                })
                ).subscribe(
                    (res2: ReadResource) => {
                        this.eventBusService.emit(new EmitEvent(Events.ValueAdded));
                        this.submittingValue = false;
                    }
                );
            } else {
                console.error('invalid value');
                this.submittingValue = false;
            }
    }

    cancelAddValue() {
        this.createModeActive = false;
        this.operationCancelled.emit();
    }

}
