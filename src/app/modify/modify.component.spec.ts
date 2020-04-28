import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModifyComponent} from './modify.component';
import {KnoraApiConnectionToken} from '@knora/ui';
import {of} from 'rxjs';
import {Component, Input} from '@angular/core';
import {ApiResponseData, AuthenticationEndpointV2, LoginResponse} from '@knora/api';

@Component({
    selector: `kui-resource-view`,
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
                    provide: KnoraApiConnectionToken,
                    useValue: authSpyObj
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        const authSpy = TestBed.inject(KnoraApiConnectionToken);

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
