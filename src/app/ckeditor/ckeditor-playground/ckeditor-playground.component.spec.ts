import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CkeditorPlaygroundComponent } from './ckeditor-playground.component';
import { DspApiConnectionToken } from '@dasch-swiss/dsp-ui';
import { ReadResource, ResourcesEndpointV2 } from '@dasch-swiss/dsp-js';
import { of } from 'rxjs';
import { ApiResponseData, AuthenticationEndpointV2, LoginResponse } from '@dasch-swiss/dsp-js/index';


describe('CkeditorPlaygroundComponent', () => {
    let component: CkeditorPlaygroundComponent;
    let fixture: ComponentFixture<CkeditorPlaygroundComponent>;

    beforeEach(async(() => {
        const dspSpyObj = {
            v2: {
                auth: jasmine.createSpyObj('auth', ['login']),
                res: jasmine.createSpyObj('res', ['getResource']),
                values: jasmine.createSpyObj('values', ['updateValue', 'getValue'])
            }
        };

        TestBed.configureTestingModule({
            declarations: [CkeditorPlaygroundComponent],
            providers: [
                {
                    provide: DspApiConnectionToken,
                    useValue: dspSpyObj
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        const dspSpy = TestBed.inject(DspApiConnectionToken);

        (dspSpy.v2.auth as jasmine.SpyObj<AuthenticationEndpointV2>).login.and.returnValue(
            of({} as ApiResponseData<LoginResponse>)
        );

        (dspSpy.v2.res as jasmine.SpyObj<ResourcesEndpointV2>).getResource.and.returnValue(of(new ReadResource()));

        fixture = TestBed.createComponent(CkeditorPlaygroundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
