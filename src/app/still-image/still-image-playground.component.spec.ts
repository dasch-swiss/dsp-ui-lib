import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StillImagePlaygroundComponent } from './still-image-playground.component';
import { DspApiConnectionToken, DspViewerModule } from '@dasch-swiss/dsp-ui';
import {
    ApiResponseData,
    AuthenticationEndpointV2,
    MockResource, ReadResource,
    ResourcesEndpointV2
} from '@dasch-swiss/dsp-js';
import { of } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { AjaxResponse } from 'rxjs/ajax';

describe('StillImageComponent', () => {
    let component: StillImagePlaygroundComponent;
    let fixture: ComponentFixture<StillImagePlaygroundComponent>;

    beforeEach(async(() => {
        const authSpyObj = {
            v2: {
                auth: jasmine.createSpyObj('auth', ['logout']),
                res: jasmine.createSpyObj('res', ['getResource'])
            }
        };

        TestBed.configureTestingModule({
            declarations: [StillImagePlaygroundComponent],
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

        (dspSpy.v2.auth as jasmine.SpyObj<AuthenticationEndpointV2>).logout.and.returnValue(
            of(ApiResponseData.fromAjaxResponse({} as AjaxResponse))
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

        fixture = TestBed.createComponent(StillImagePlaygroundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
