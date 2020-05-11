import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModifyComponent} from './modify.component';
import {DspApiConnectionToken} from '@dasch-swiss/dsp-ui';
import {of} from 'rxjs';
import {Component, Input} from '@angular/core';
import {ApiResponseData, AuthenticationEndpointV2, LoginResponse} from '@knora/api';

@Component({
    selector: `dsp-resource-view`,
    template: ``
})
class TestResourceViewerComponent {

    @Input() iri;

}

describe('ModifyComponent', () => {
    let component: ModifyComponent;
    let fixture: ComponentFixture<ModifyComponent>;

    beforeEach(async(() => {
        const authSpyObj = {
            v2: {
                auth: jasmine.createSpyObj('auth', ['login'])
            }
        };

        TestBed.configureTestingModule({
            declarations: [ModifyComponent, TestResourceViewerComponent],
            providers: [
                {
                    provide: DspApiConnectionToken,
                    useValue: authSpyObj
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        const authSpy = TestBed.inject(DspApiConnectionToken);

        (authSpy.v2.auth as jasmine.SpyObj<AuthenticationEndpointV2>).login.and.returnValue(
            of({} as ApiResponseData<LoginResponse>)
        );

        fixture = TestBed.createComponent(ModifyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
