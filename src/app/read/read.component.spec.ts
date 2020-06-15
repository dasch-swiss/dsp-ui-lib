import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReadComponent} from './read.component';
import {DspApiConnectionToken} from '@dasch-swiss/dsp-ui';
import {of} from 'rxjs';
import {Component, Input} from '@angular/core';
import {ApiResponseData, AuthenticationEndpointV2, LogoutResponse} from '@dasch-swiss/dsp-js';

@Component({
    selector: `dsp-resource-view`,
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
                    provide: DspApiConnectionToken,
                    useValue: authSpyObj
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        const authSpy = TestBed.inject(DspApiConnectionToken);

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
