import { async, TestBed } from '@angular/core/testing';
import { KnoraApiConfig, MockUsers, UsersEndpointAdmin } from '@dasch-swiss/dsp-js';
import { of } from 'rxjs';
import { DspApiConfigToken, DspApiConnectionToken } from './core.module';
import { SessionService, Session } from './session.service';

describe('SessionService', () => {
    let service: SessionService;

    const dspConfSpy = new KnoraApiConfig('http', 'localhost', 3333, undefined, undefined, true);

    const dspConnSpy = {
        admin: {
            usersEndpoint: jasmine.createSpyObj('usersEndpoint', ['getUser'])
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                {
                    provide: DspApiConfigToken,
                    useValue: dspConfSpy
                },
                {
                    provide: DspApiConnectionToken,
                    useValue: dspConnSpy
                }
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
                return (store[key] = <any>value);
            }
        );
        spyOn(localStorage, 'clear').and.callFake(() => {
            store = {};
        });
    });

    beforeEach(() => {

        const valuesSpy = TestBed.inject(DspApiConnectionToken);

        (valuesSpy.admin.usersEndpoint as jasmine.SpyObj<UsersEndpointAdmin>).getUser.and.callFake(
            () => {
                const loggedInUser = MockUsers.mockUser();
                return of(loggedInUser);
            }
        );
    });


    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should store user information in local storage', () => {

        const userSpy = TestBed.inject(DspApiConnectionToken);
        let ls: Session;

        service.setSession(undefined, 'anything.user01', 'username');
        expect(userSpy.admin.usersEndpoint.getUser).toHaveBeenCalledTimes(1);
        ls = JSON.parse(localStorage.getItem('session'));
        expect(ls.user.name).toEqual('anything.user01');
        expect(ls.user.lang).toEqual('de');
        expect(ls.user.sysAdmin).toEqual(false);
        expect(ls.user.projectAdmin.length).toEqual(0);

    });
});
