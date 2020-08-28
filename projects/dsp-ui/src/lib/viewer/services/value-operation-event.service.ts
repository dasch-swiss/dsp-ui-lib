import { BaseValue } from '@dasch-swiss/dsp-js';
import { Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

/**
 * https://stackoverflow.com/questions/56290722/how-pass-a-event-from-deep-nested-child-to-parent-in-angular-2
 * This service is used as a way to enable components to communicate with each other no matter how nested they are.
 * This is intended to provide a cleaner way to emit events from nested components than chaining '@Outputs'.
 * The ValueOperationEventService essentially creates a direct communication channel between
 * the emitting component and the listening component.
 */
export class ValueOperationEventService {

    // Create a subject to hold data which can be subscribed to.
    // You only get the data after you subscribe.
    private _subject$ = new Subject();

    // Used in the listening component.
    // i.e. this.valueOperationEventSubscription = this._valueOperationEventService.on(Events.ValueAdded, () => doSomething());
    on(event: Events, action: (newValue: any) => void): Subscription {
        console.log('subject: ', this._subject$);

        return this._subject$
            .pipe(
                // Filter down based on event name to any events that are emitted out of the subject from the emit method below.
                filter((e: EmitEvent) => e.name === event),
                map((e: EmitEvent) => e.value),
            )
            .subscribe(action); // Subscribe to the subject to get the data.
    }

    // Used in the emitting component.
    // i.e. this.valueOperationEventService.emit(new EmitEvent(Events.ValueAdded));
    emit(event: EmitEvent) {
        this._subject$.next(event);
    }
}

export class EmitEvent {
    constructor(public name: any, public value?: BaseValue) { }
}

// Possible events that can be emitted.
export enum Events {
    ValueAdded,
    ValueDeleted,
    ValueUpdated
}
