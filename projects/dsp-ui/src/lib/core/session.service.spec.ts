import { TestBed } from '@angular/core/testing';
import { DspApiConfigToken, DspApiConnectionToken } from './core.module';
import { SessionService } from './session.service';
import { KnoraApiConnection, KnoraApiConfig } from '@knora/api';

describe('SessionService', () => {

    let service: SessionService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                SessionService,
                {
                    provide: DspApiConfigToken,
                    useValue: KnoraApiConfig
                },
                {
                    provide: DspApiConnectionToken,
                    useValue: KnoraApiConnection
                }
            ]
        });
        service = TestBed.inject(SessionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
