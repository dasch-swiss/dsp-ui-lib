import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { EmitEvent, EventBusService, Events } from './event-bus.service';

describe('EventBusService', () => {
    let service: EventBusService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EventBusService]
        });
        service = TestBed.inject(EventBusService);
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
        let eventBusSubscription: Subscription;

        // listen for ValueAdded event
        eventBusSubscription = service.on(Events.ValueAdded, () => valuesCount += 1);

        // emit ValueAdded event
        service.emit(new EmitEvent(Events.ValueAdded));

        expect(valuesCount).toEqual(3);

        eventBusSubscription.unsubscribe();

        // emit ValueAdded event again, this time it should not trigger the callback
        service.emit(new EmitEvent(Events.ValueAdded));

        expect(valuesCount).toEqual(3);

    });
});
