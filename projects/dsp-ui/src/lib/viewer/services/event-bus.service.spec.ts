import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { EmitEvent, ValueOperationEventService, Events } from './event-bus.service';

describe('ValueOperationEventService', () => {
    let service: ValueOperationEventService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ValueOperationEventService]
        });
        service = TestBed.inject(ValueOperationEventService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should listen for events and execute code in the callback when the event is emitted', () => {
        let valuesCount = 2;

        // listen for ValueAdded event
        service.on(Events.ValueAdded, () => valuesCount += 1);

        // listen for ValueDeleted event
        service.on(Events.ValueDeleted, () => valuesCount -= 1);

        // emit ValueAdded event
        service.emit(new EmitEvent(Events.ValueAdded));

        expect(valuesCount).toEqual(3);

        // emit ValueDeleted event
        service.emit(new EmitEvent(Events.ValueDeleted));

        expect(valuesCount).toEqual(2);
    });

    it('should no longer execute the callback code when an event is emitted after unsubscribing', () => {
        let valuesCount = 2;
        let valueOperationEventSubscription: Subscription;

        // listen for ValueAdded event
        valueOperationEventSubscription = service.on(Events.ValueAdded, () => valuesCount += 1);

        // emit ValueAdded event
        service.emit(new EmitEvent(Events.ValueAdded));

        expect(valuesCount).toEqual(3);

        valueOperationEventSubscription.unsubscribe();

        // emit ValueAdded event again, this time it should not trigger the callback
        service.emit(new EmitEvent(Events.ValueAdded));

        expect(valuesCount).toEqual(3);

    });
});
