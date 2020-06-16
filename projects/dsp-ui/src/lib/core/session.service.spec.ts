import { async, TestBed } from '@angular/core/testing';
import { KnoraApiConfig, KnoraApiConnection } from '@dasch-swiss/dsp-js';
import { DspApiConfigToken, DspApiConnectionToken } from './core.module';
import { SessionService } from './session.service';

describe('SessionService', () => {

    let service: SessionService;

    const config = new KnoraApiConfig('http', 'localhost', 3333, undefined, undefined, true);
    const knoraApiConnection = new KnoraApiConnection(config);

    beforeEach(async(() => {

        const adminSpyObj = {
            admin: {
                usersEndpoint: jasmine.createSpyObj('usersEndpoint', ['getUser'])
            }
        };

        TestBed.configureTestingModule({
            imports: [],
            providers: [
                SessionService,
                {
                    provide: DspApiConfigToken,
                    useValue: config
                },
                {
                    provide: DspApiConnectionToken,
                    useValue: knoraApiConnection
                },
            ]
        });
        service = TestBed.inject(SessionService);
    }));

    // mock localStorage
    beforeEach(() => {
        let store = {};

        spyOn(localStorage, 'getItem').and.callFake(
            (key: string): string => {
                return store[key] || null;
            }
        );
        spyOn(localStorage, 'removeItem').and.callFake(
            (key: string): void => {
                delete store[key];
            }
        );
        spyOn(localStorage, 'setItem').and.callFake(
            (key: string, value: string): string => {
                return (store[key] = value as any);
            }
        );
        spyOn(localStorage, 'clear').and.callFake(() => {
            store = {};
        });

    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // it('should store a users jwt in local storage', () => {

    //     service.setSession('jwtToken', 'root', 'username');

    //     const ls = JSON.parse(localStorage.getItem('session')) as Session;

    //     console.log(ls);

    //     expect(ls.user.jwt).toEqual('jwtToken');
    // });
});
