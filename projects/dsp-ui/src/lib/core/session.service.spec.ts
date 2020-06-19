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

fdescribe('SessionService', () => {

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

    beforeEach(() => {
        // login and set session
        knoraApiConnection.v2.auth.login("username", "root", "test").subscribe(
            (response: ApiResponseData<LoginResponse>) => {
                service.setSession(response.body.token, 'root', 'username');
            }
        );
    });

    // it('should create', () => {
    //     expect<any>(localStorage.getItem('session')).toBe(
    //         JSON.stringify(TestConfig.CurrentSession)
    //     );
    // });


    it('should store a users jwt in local storage', () => {

        let ls: Session;

        setTimeout(() => {
            console.log(localStorage.getItem('session'));
            ls = JSON.parse(localStorage.getItem('session'));
        }, 500);

        expect(ls.user.name).toEqual('root');
        // expect(JSON.parse(localStorage.getItem('session')).user.name).toEqual('root');


        // // get test data
        // let user;

        // // fetch('https://raw.githubusercontent.com/dasch-swiss/knora-api-js-lib/master/test/data/api/admin/users/get-user-response.json')
        // //     .then(res => res.json())
        // //     .then((mockedUser) => {
        // //         console.log('Output:', mockedUser);
        // //         user = mockedUser;
        // //     }).catch(err => console.error(err));

        // // const user = require(data);
        // // console.log(user);

        // // service.setSession('myJsonWebToken', 'root', 'username');



        // expect<any>(localStorage.getItem('session')).toBe(
        //     JSON.stringify(TestConfig.CurrentSession)
        // );



        // const value = browser.executeScript("return window.localStorage.getItem('session');");

        //     service.setSession('jwtToken', 'root', 'username');

        //     const ls = JSON.parse(localStorage.getItem('session')) as Session;

        //     console.log(ls);

        //     expect(ls.user.jwt).toEqual('jwtToken');
    });
});
