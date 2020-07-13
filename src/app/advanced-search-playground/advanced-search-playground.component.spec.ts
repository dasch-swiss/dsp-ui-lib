import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSearchPlaygroundComponent } from './advanced-search-playground.component';
import { Component } from '@angular/core';
import { DspApiConnectionToken } from '@dasch-swiss/dsp-ui';
import { ApiResponseData, AuthenticationEndpointV2, LogoutResponse } from '@dasch-swiss/dsp-js';
import { of } from 'rxjs';

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: 'dsp-advanced-search',
    template: ``
})
class TestHostComponent {
}

describe('AdvancedSearchPlaygroundComponent', () => {
    let component: AdvancedSearchPlaygroundComponent;
    let fixture: ComponentFixture<AdvancedSearchPlaygroundComponent>;

    const authSpyObj = {
        v2: {
            auth: jasmine.createSpyObj('auth', ['logout'])
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AdvancedSearchPlaygroundComponent, TestHostComponent],
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

        fixture = TestBed.createComponent(AdvancedSearchPlaygroundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
