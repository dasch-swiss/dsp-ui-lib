import { Component, Input, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { MockList, ReadResourceSequence, SearchEndpointV2, MockResource, MockResources, ResourcesEndpointV2 } from '@dasch-swiss/dsp-js';
import { map } from 'rxjs/internal/operators/map';
import { DspApiConnectionToken } from '../../../../core';
import { ResourceListComponent } from './resource-list.component';

/**
 * Test host component to simulate child component, here property-view.
 */
@Component({
    selector: `dsp-resource-list`,
    template: ``
})
class TestResourceListComponent {

    @Input() resources: ReadResourceSequence;

}

/**
 * Test host component to simulate resource-list component.
 */
@Component({
    template: `
      <dsp-resource-view #resList [iri]="resourceIri"></dsp-resource-view>`
})
class TestParentComponent {

    @ViewChild('resList') resourceListComponent: ResourceListComponent;

    resourceIri = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';
}

describe('ResourceListComponent', () => {
    let component: ResourceListComponent;
    let fixture: ComponentFixture<ResourceListComponent>;

    const spyObj = {
        v2: {
            res: jasmine.createSpyObj('res', ['doFulltextSearch'])
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ResourceListComponent,
                TestParentComponent,
                TestResourceListComponent
            ],
            imports: [
                MatListModule
            ],
            providers: [
                {
                    provide: DspApiConnectionToken,
                    useValue: spyObj
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        const resSpy = TestBed.inject(DspApiConnectionToken);

        (resSpy.v2.res as jasmine.SpyObj<ResourcesEndpointV2>).getResources.and.callFake(
            (ids: string[]) => {

              return MockResources.getTestthings().pipe(
                map(
                  (res: ReadResourceSequence) => {
                    console.log(res);
                    return res;
                  }
                ));
            }
          );



        // (resSpy.v2.search as jasmine.SpyObj<SearchEndpointV2>).doFulltextSearch.and.callFake(
        //   (query: string) => {

        //     return MockResources.getTestthings().pipe(
        //       map(
        //         (res: ReadResourceSequence) => {
        //             console.log(res);
        //         //   res.id = id;
        //           return res;
        //         }
        //       ));
        //   }
        // );
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
