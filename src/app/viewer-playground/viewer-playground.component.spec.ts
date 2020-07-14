import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerPlaygroundComponent } from './viewer-playground.component';
import { DspViewerModule, DspApiConnectionToken } from '@dasch-swiss/dsp-ui';
import { SearchEndpointV2, ReadResourceSequence, ApiResponseData } from '@dasch-swiss/dsp-js';
import { of } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { MatLineModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

describe('ViewerPlaygroundComponent', () => {
    let component: ViewerPlaygroundComponent;
    let fixture: ComponentFixture<ViewerPlaygroundComponent>;

    beforeEach(async(() => {

        const searchSpyObj = {
            v2: {
                search: jasmine.createSpyObj('search', ['doFulltextSearch']),
            }
        };

        TestBed.configureTestingModule({
            declarations: [
                ViewerPlaygroundComponent
            ],
            imports: [
                DspViewerModule,
                MatIconModule,
                MatLineModule,
                MatListModule
            ],
            providers: [
                {
                    provide: DspApiConnectionToken,
                    useValue: searchSpyObj
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        const searchSpy = TestBed.inject(DspApiConnectionToken);

        (searchSpy.v2.search as jasmine.SpyObj<SearchEndpointV2>).doFulltextSearch.and.returnValue(
            of({} as ReadResourceSequence)
        );

      fixture = TestBed.createComponent(ViewerPlaygroundComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
