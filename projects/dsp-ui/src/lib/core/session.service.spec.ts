import { async, TestBed } from '@angular/core/testing';
import { KnoraApiConfig, MockUsers, UsersEndpointAdmin, AuthenticationEndpointV2, CredentialsResponse, ApiResponseData, ApiResponseError, LoginResponse } from '@dasch-swiss/dsp-js';
import { of } from 'rxjs';
import { DspApiConfigToken, DspApiConnectionToken } from './core.module';
import { SessionService, Session } from './session.service';

describe('SessionService', () => {
    let service: SessionService;

    const dspConfSpy = new KnoraApiConfig('http', 'localhost', 3333, undefined, undefined, true);

    const dspConnSpy = {
        admin: {
            usersEndpoint: jasmine.createSpyObj('usersEndpoint', ['getUser'])
        },
        v2: {
            auth: jasmine.createSpyObj('auth', ['checkCredentials', 'login'])
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
                return (store[key] = value as any);
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
                console.log('getting a fake user');

                const loggedInUser = MockUsers.mockUser();
                return of(loggedInUser);
            }
        );

        (valuesSpy.v2.auth as jasmine.SpyObj<AuthenticationEndpointV2>).checkCredentials.and.callFake(
            () => {
                console.log('checking credentials');

                const response: ApiResponseData<CredentialsResponse> =
                    new CredentialsResponse() as unknown as ApiResponseData<CredentialsResponse>;

                response.body.message = 'credentials are OK';

                return of(response);
            }
        );

        (valuesSpy.v2.auth as jasmine.SpyObj<AuthenticationEndpointV2>).login.and.returnValue(
            of({} as ApiResponseData<LoginResponse>)
        );

        service.setSession(undefined, 'anything.user01', 'username');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should store user information in local storage', () => {
        const ls: Session = JSON.parse(localStorage.getItem('session'));
        expect(ls.user.name).toEqual('anything.user01');
        expect(ls.user.lang).toEqual('de');
        expect(ls.user.sysAdmin).toEqual(false);
        expect(ls.user.projectAdmin.length).toEqual(0);

    });

    it('should get the session with user information', () => {
        const session: Session = service.getSession();
        expect(session.user.name).toEqual('anything.user01');
        expect(session.user.lang).toEqual('de');
        expect(session.user.sysAdmin).toEqual(false);
        expect(session.user.projectAdmin.length).toEqual(0);
    });

    it('should destroy the session', () => {
        service.destroySession();
        const ls: Session = JSON.parse(localStorage.getItem('session'));
        expect(ls).toEqual(null);
    });

    describe('isSessionValid', () => {

        it('should return false if there is no session', () => {
            service.destroySession();
            const isValid = service.isSessionValid();
            expect(isValid).toBeFalsy();
        });

        it('should return true if session is still valid', () => {
            const isValid = service.isSessionValid();
            expect(isValid).toBeTruthy();
        });

        xit('should get credentials again if session has expired', () => {
            let session: Session = service.getSession();

            // manually set id to an expired value
            session.id = 0;

            // store session again
            localStorage.setItem('session', JSON.stringify(session));

            // get session info again in order to get the expired session
            session = service.getSession();

            const isValid = service.isSessionValid();

            expect(dspConnSpy.v2.auth.checkCredentials).toHaveBeenCalledTimes(1);

            expect(isValid).toBeTruthy();
        });
    });

});
