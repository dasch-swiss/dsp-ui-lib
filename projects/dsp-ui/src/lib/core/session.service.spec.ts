import { async, TestBed } from '@angular/core/testing';
import {
    ApiResponseData,
    AuthenticationEndpointV2,
    CredentialsResponse,
    KnoraApiConfig,
    MockUsers,
    UsersEndpointAdmin
} from '@dasch-swiss/dsp-js';
import { of } from 'rxjs';
import { DspApiConfigToken, DspApiConnectionToken } from './core.module';
import { Session, SessionService } from './session.service';

describe('SessionService', () => {
    let service: SessionService;

    beforeEach(async(() => {

        const dspConnSpy = {
            admin: {
                usersEndpoint: jasmine.createSpyObj('usersEndpoint', ['getUser'])
            },
            v2: {
                auth: jasmine.createSpyObj('auth', ['checkCredentials', 'login']),
                jsonWebToken: ''
            },

        };

        TestBed.configureTestingModule({
            providers: [
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
            (key: string, value: string): void => {
                store[key] = value;
            }
        );
        spyOn(localStorage, 'clear').and.callFake(() => {
            store = {};
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('Method setSession', () => {

        it('should store user information in local storage without a jwt', () => {
            const dspSpy = TestBed.inject(DspApiConnectionToken);

            (dspSpy.admin.usersEndpoint as jasmine.SpyObj<UsersEndpointAdmin>).getUser.and.callFake(
                () => {
                    const loggedInUser = MockUsers.mockUser();
                    return of(loggedInUser);
                }
            );

            service.setSession(undefined, 'anything.user01', 'username').subscribe( () => {
                const ls: Session = JSON.parse(localStorage.getItem('session'));

                expect(dspSpy.v2.jsonWebToken).toEqual('');

                expect(ls.user.name).toEqual('anything.user01');
                expect(ls.user.jwt).toBeUndefined();
                expect(ls.user.lang).toEqual('de');
                expect(ls.user.sysAdmin).toEqual(false);
                expect(ls.user.projectAdmin.length).toEqual(0);

                expect(dspSpy.admin.usersEndpoint.getUser).toHaveBeenCalledTimes(1);
                expect(dspSpy.admin.usersEndpoint.getUser).toHaveBeenCalledWith('username', 'anything.user01');

            });

        });

        it('should store user information in local storage with a jwt', () => {
            const dspSpy = TestBed.inject(DspApiConnectionToken);

            (dspSpy.admin.usersEndpoint as jasmine.SpyObj<UsersEndpointAdmin>).getUser.and.callFake(
                () => {
                    const loggedInUser = MockUsers.mockUser();
                    return of(loggedInUser);
                }
            );

            service.setSession('mytoken', 'anything.user01', 'username').subscribe( () => {
                const ls: Session = JSON.parse(localStorage.getItem('session'));

                expect(dspSpy.v2.jsonWebToken).toEqual('mytoken');

                expect(ls.user.name).toEqual('anything.user01');
                expect(ls.user.jwt).toEqual('mytoken');
                expect(ls.user.lang).toEqual('de');
                expect(ls.user.sysAdmin).toEqual(false);
                expect(ls.user.projectAdmin.length).toEqual(0);

                expect(dspSpy.admin.usersEndpoint.getUser).toHaveBeenCalledTimes(1);
                expect(dspSpy.admin.usersEndpoint.getUser).toHaveBeenCalledWith('username', 'anything.user01');

            });

        });
    });

    describe('Method getSession', () => {

        it('should get the session with user information', () => {
            const dspSpy = TestBed.inject(DspApiConnectionToken);

            (dspSpy.admin.usersEndpoint as jasmine.SpyObj<UsersEndpointAdmin>).getUser.and.callFake(
                () => {
                    const loggedInUser = MockUsers.mockUser();
                    return of(loggedInUser);
                }
            );

            service.setSession(undefined, 'anything.user01', 'username').subscribe( () => {
                const session: Session = service.getSession();
                expect(session.user.name).toEqual('anything.user01');
                expect(session.user.lang).toEqual('de');
                expect(session.user.sysAdmin).toEqual(false);
                expect(session.user.projectAdmin.length).toEqual(0);
            });
        });
    });

    describe('destroySession', () => {

        it('should destroy the session', () => {
            const dspSpy = TestBed.inject(DspApiConnectionToken);

            (dspSpy.admin.usersEndpoint as jasmine.SpyObj<UsersEndpointAdmin>).getUser.and.callFake(
                () => {
                    const loggedInUser = MockUsers.mockUser();
                    return of(loggedInUser);
                }
            );

            service.setSession(undefined, 'anything.user01', 'username').subscribe( () => {
                service.destroySession();
                const ls: Session = JSON.parse(localStorage.getItem('session'));
                expect(ls).toEqual(null);
            });
        });
    });

    describe('isSessionValid', () => {

        it('should return false if there is no session', () => {
            service.isSessionValid().subscribe( (isValid) => {
                expect(isValid).toBeFalsy();
            });
        });

        it('should return true if session is still valid', () => {
            const dspSpy = TestBed.inject(DspApiConnectionToken);

            (dspSpy.admin.usersEndpoint as jasmine.SpyObj<UsersEndpointAdmin>).getUser.and.callFake(
                () => {
                    const loggedInUser = MockUsers.mockUser();
                    return of(loggedInUser);
                }
            );

            service.setSession(undefined, 'anything.user01', 'username').subscribe( () => {
                service.isSessionValid().subscribe( (isValid) => {
                    expect(isValid).toBeTruthy();
                });
            });
        });

        it('should get credentials again if session has expired', () => {
            const dspSpy = TestBed.inject(DspApiConnectionToken);

            (dspSpy.admin.usersEndpoint as jasmine.SpyObj<UsersEndpointAdmin>).getUser.and.callFake(
                () => {
                    const loggedInUser = MockUsers.mockUser();
                    return of(loggedInUser);
                }
            );

            (dspSpy.v2.auth as jasmine.SpyObj<AuthenticationEndpointV2>).checkCredentials.and.callFake(
                () => {
                    const response: CredentialsResponse = new CredentialsResponse();

                    response.message = 'credentials are OK';

                    return of(response as unknown as ApiResponseData<CredentialsResponse>);
                }
            );

            service.setSession(undefined, 'anything.user01', 'username').subscribe( () => {

                let session: Session = service.getSession();

                // manually set id to an expired value
                session.id = 0;

                // store session again
                localStorage.setItem('session', JSON.stringify(session));

                // get session info again in order to get the expired session
                session = service.getSession();

                service.isSessionValid().subscribe( (isValid) => {
                    expect(isValid).toBeFalsy();
                    expect(dspSpy.v2.auth.checkCredentials).toHaveBeenCalledTimes(1);
                });

            });

        });
    });

});
