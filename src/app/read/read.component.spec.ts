import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReadComponent} from './read.component';
import {KnoraApiConnectionToken} from 'knora-ui';
import {of} from 'rxjs';
import {Input, Component} from '@angular/core';
import {ApiResponseData, AuthenticationEndpointV2, LoginResponse, LogoutResponse} from "@knora/api";

@Component({
    selector: `kui-resource-view`,
    template: ``
})
class TestResourceViewerComponent {

    @Input() iri;

}

describe('ReadComponent', () => {
    let component: ReadComponent;
    let fixture: ComponentFixture<ReadComponent>;

    beforeEach(async(() => {
        const authSpyObj = {
            v2: {
                auth: jasmine.createSpyObj('auth', ['logout'])
            }
        };

        TestBed.configureTestingModule({
            declarations: [ReadComponent, TestResourceViewerComponent],
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

        (authSpy.v2.auth as jasmine.SpyObj<AuthenticationEndpointV2>).logout.and.returnValue(
            of({} as ApiResponseData<LogoutResponse>)
        );
        
        fixture = TestBed.createComponent(ReadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
