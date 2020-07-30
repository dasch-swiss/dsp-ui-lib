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
import { EmitEvent, ValueOperationEventService, Events } from '../../services/value-operation-event.service';
import { BaseValueComponent } from '../../values/base-value.component';

@Component({
    selector: 'dsp-add-value',
    templateUrl: './add-value.component.html',
    styleUrls: ['./add-value.component.scss']
})
export class AddValueComponent implements OnInit {

    @ViewChild('createVal') createValueComponent: BaseValueComponent;

    @Input() resourcePropertyDefinition: ResourcePropertyDefinition;

    @Input() parentResource: ReadResource;

    @Input() configuration?: object;

    @Output() operationCancelled = new EventEmitter<any>();

    constants = Constants;

    mode: 'read' | 'update' | 'create' | 'search';

    createModeActive = false;

    submittingValue = false;

    // 0 will display a loading animation
    progressIndicatorStatus = 0;

    progressIndicatorColor = 'blue';

    constructor(
        @Inject(DspApiConnectionToken) private _dspApiConnection: KnoraApiConnection,
        private _valueOperationEventService: ValueOperationEventService) { }

    ngOnInit() {

        this.mode = 'create';

        this.createModeActive = true;

        // TODO: find a way to figure out what type of text value it is
        if (this.resourcePropertyDefinition.objectType === 'http://api.knora.org/ontology/knora-api/v2#TextValue') {
            this.resourcePropertyDefinition.objectType = 'ReadTextValueAsString';
        }
    }

    /**
     * Add a new value to an existing property of a resource.
     */
    saveAddValue() {
        // hide the CRUD buttons
        this.createModeActive = false;

        // show the progress indicator
        this.submittingValue = true;

        // get a new CreateValue from the base class and grab the values from the form
        const createVal = this.createValueComponent.getNewValue();

        if (createVal instanceof CreateValue) {

            // create a new UpdateResource with the same properties as the parent resource
            const updateRes = new UpdateResource();
            updateRes.id = this.parentResource.id;
            updateRes.type = this.parentResource.type;
            updateRes.property = this.resourcePropertyDefinition.id;

            // assign the new value to the UpdateResource value
            updateRes.value = createVal;

            this._dspApiConnection.v2.values.createValue(updateRes as UpdateResource<CreateValue>).pipe(
                mergeMap((res: WriteValueResponse) => {
                    // if successful, get the newly created value
                    return this._dspApiConnection.v2.values.getValue(this.parentResource.id, res.uuid);
                })
            ).subscribe(
                (res2: ReadResource) => {
                    // emit a ValueAdded event to the listeners in:
                    // property-view component to hide the add value form
                    // resource-view component to trigger a refresh of the resource
                    this._valueOperationEventService.emit(new EmitEvent(Events.ValueAdded));

                    // hide the progress indicator
                    this.submittingValue = false;
                },
                (err: Error) => {
                    console.error('There was an issue submitting your value: ', err);

                    // hide the progress indicator
                    this.submittingValue = false;

                    // show the CRUD buttons
                    this.createModeActive = true;
                }

            );
        } else {
            console.error('invalid value');

            // hide the progress indicator
            this.submittingValue = false;
        }
    }

    /**
     * Cancel the add value operation and hide the add value form.
     */
    cancelAddValue() {
        // show the CRUD buttons
        this.createModeActive = false;

        // emit an event to trigger hideAddValueForm() in property-view component to hide the create value form
        this.operationCancelled.emit();
    }

}
