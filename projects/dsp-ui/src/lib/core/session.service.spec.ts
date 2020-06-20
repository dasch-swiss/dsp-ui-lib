import { async, TestBed } from '@angular/core/testing';
import { KnoraApiConfig, KnoraApiConnection, ApiResponseData, LoginResponse } from '@dasch-swiss/dsp-js';
import { DspApiConfigToken, DspApiConnectionToken } from './core.module';
import { Session, SessionService } from './session.service';

export class TestConfig {

    public static CurrentSession: Session = {
        id: 1555226377250,
        user: {
            jwt: 'myJsonWebToken',
            lang: 'en',
            name: 'root',
            projectAdmin: [],
            sysAdmin: false
        }
    };
}

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
                return (store[key] = <any>value);
            }
        );
        spyOn(localStorage, 'clear').and.callFake(() => {
            store = {};
        });
    });

    it('should store user information in local storage', done => {

        knoraApiConnection.v2.auth.login("username", "root", "test").subscribe(
            (response: ApiResponseData<LoginResponse>) => {
                service.setSession(response.body.token, 'root', 'username');
                let ls: Session;
                setTimeout(() => {
                    console.log(localStorage.getItem('session'));
                    ls = JSON.parse(localStorage.getItem('session'));
                    expect(ls.user.name).toEqual('root');
                    expect(ls.user.lang).toEqual('de');
                    expect(ls.user.sysAdmin).toEqual(true);
                    expect(ls.user.projectAdmin.length).toEqual(0);
                    done();
                }, 800);
            }
        );

    });
});
