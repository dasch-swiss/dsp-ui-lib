import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StillImagePlaygroundComponent } from './still-image-playground.component';
import { DspApiConnectionToken, DspViewerModule } from '@dasch-swiss/dsp-ui';
import {
    ApiResponseData,
    AuthenticationEndpointV2, LogoutResponse,
    MockResource, ReadResource,
    ResourcesEndpointV2
} from '@dasch-swiss/dsp-js';
import { of } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { AjaxResponse } from 'rxjs/ajax';
import { Component, OnInit } from '@angular/core';
import { Test } from 'tslint';

@Component({
    template: `
        <dsp-still-image [images]="[]"
                         [imageCaption]="">
        </dsp-still-image>`
})
class TestHostComponent {
}

describe('StillImageComponent', () => {
    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        const authSpyObj = {
            v2: {
                auth: jasmine.createSpyObj('auth', ['logout']),
                res: jasmine.createSpyObj('res', ['getResource'])
            }
        };

        TestBed.configureTestingModule({
            declarations: [StillImagePlaygroundComponent, TestHostComponent],
            providers: [
                {
                    provide: DspApiConnectionToken,
                    useValue: authSpyObj
                }
            ],
            imports: [
                DspViewerModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        const dspSpy = TestBed.inject(DspApiConnectionToken);

        (dspSpy.v2.auth as jasmine.SpyObj<AuthenticationEndpointV2>).logout.and.callFake(
            () => {
                const rd = ApiResponseData.fromAjaxResponse({} as AjaxResponse);
                rd.body = new LogoutResponse();
                return of(rd as ApiResponseData<LogoutResponse>);
            }
        );

        (dspSpy.v2.res as jasmine.SpyObj<ResourcesEndpointV2>).getResource.and.callFake(
            (id: string) => {

                return MockResource.getTestthing().pipe(
                    map(
                        (res: ReadResource) => {
                            res.id = id;
                            return res;
                        }
                    ));
            }
        );

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
