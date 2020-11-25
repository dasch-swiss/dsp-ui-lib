import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatListModule } from '@angular/material/list';
import { RouterTestingModule } from '@angular/router/testing';
import { DspActionModule, DspApiConnectionToken } from '@dasch-swiss/dsp-ui';
import { ActionPlaygroundComponent } from './action-playground.component';
import { ApiResponseData, AuthenticationEndpointV2, LoginResponse, MockProjects, UsersEndpointAdmin } from '@dasch-swiss/dsp-js';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ActionPlaygroundComponent', () => {
    let component: ActionPlaygroundComponent;
    let fixture: ComponentFixture<ActionPlaygroundComponent>;

    beforeEach(async(() => {
        const dspConnSpy = {
            v2: {
                auth: jasmine.createSpyObj('auth', ['login'])
            },
            admin: {
                usersEndpoint: jasmine.createSpyObj('usersEndpoint', ['getUserProjectMemberships'])
            }
        };

        TestBed.configureTestingModule({
            imports: [
                DspActionModule,
                MatListModule,
                RouterTestingModule,
                BrowserAnimationsModule ],
            declarations: [ ActionPlaygroundComponent ],
            providers: [
                {
                    provide: DspApiConnectionToken,
                    useValue: dspConnSpy
                }
            ],
        })
        .compileComponents();
    }));

    beforeEach(() => {
        const valuesSpy = TestBed.inject(DspApiConnectionToken);

        (valuesSpy.v2.auth as jasmine.SpyObj<AuthenticationEndpointV2>).login.and.returnValue(
            of({} as ApiResponseData<LoginResponse>)
        );

        (valuesSpy.admin.usersEndpoint as jasmine.SpyObj<UsersEndpointAdmin>).getUserProjectMemberships.and.callFake(
            (userIri) => {
                const projects = MockProjects.mockProjects();
                return of(projects);
            }
        );

        fixture = TestBed.createComponent(ActionPlaygroundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
