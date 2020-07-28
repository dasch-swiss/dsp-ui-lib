import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CountQueryResponse, MockResource, ReadResourceSequence, SearchEndpointV2 } from '@dasch-swiss/dsp-js';
import { IFulltextSearchParams } from '@dasch-swiss/dsp-js/src/api/v2/search/search-endpoint-v2';
import { of } from 'rxjs';
import { DspApiConnectionToken } from '../../../core';
import { ListViewComponent, SearchParams } from './list-view.component';

// TODO: declare this component in the TestBed declarations, e.g. advanced-search comp.
/**
 * Test host component to simulate child component, here resource-list.
 */
@Component({
    selector: `dsp-list-view`,
    template: ``
})
class TestResourceListComponent {

    @Input() search: SearchParams;

}

/**
 * Test host component to simulate resource-list component.
 */
@Component({
    template: `
      <dsp-list-view #listView [search]="search" (resourceSelected)="openResource($event)"></dsp-list-view>`
})
class TestParentComponent implements OnInit {

    @ViewChild('listView') listViewComponent: ListViewComponent;

    search: SearchParams;

    resIri: string;

    ngOnInit() {

        this.search = {
            query: 'fake query',
            mode: 'fulltext',
            filter: {
                limitToProject: 'http://rdfh.ch/projects/0803'
            }
        };
    }

    openResource(id: string) {
        this.resIri = id;
    }

}

describe('ListViewComponent', () => {

    let testHostComponent: TestParentComponent;
    let testHostFixture: ComponentFixture<TestParentComponent>;

    beforeEach(async(() => {

        const searchSpyObj = {
            v2: {
                search: jasmine.createSpyObj('search', ['doFulltextSearch', 'doFulltextSearchCountQuery'])
            }
        };

        TestBed.configureTestingModule({
            declarations: [
                ListViewComponent,
                TestParentComponent
            ],
            imports: [
                MatButtonModule,
                MatIconModule,
                MatPaginatorModule
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

        // mock doFulltextSearchCountQuery and doFulltextSearch response before creating the component
        // TODO: check fulltext-search comp. spec as an example
        const searchSpy = TestBed.inject(DspApiConnectionToken);

        (searchSpy.v2.search as jasmine.SpyObj<SearchEndpointV2>).doFulltextSearchCountQuery.and.callFake(
            () => {
                const num = new CountQueryResponse();
                num.numberOfResults = 5;
                return of(num);
            }
        );

        (searchSpy.v2.search as jasmine.SpyObj<SearchEndpointV2>).doFulltextSearch.and.callFake(
            (searchTerm: string, offset?: number, params?: IFulltextSearchParams) => {

                let resources: ReadResourceSequence;
                // mock list of resourcses to simulate full-text search response
                MockResource.getTesthings(5).subscribe(res => {
                    resources = res;
                });
                if (resources.resources.length) {
                    return of(resources);
                }
            }
        );

        testHostFixture = TestBed.createComponent(TestParentComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();

        expect(testHostComponent).toBeTruthy();
    });

    it('should do fulltext search', () => {

        const searchSpy = TestBed.inject(DspApiConnectionToken);

        expect(
            searchSpy.v2.search.doFulltextSearchCountQuery
        ).toHaveBeenCalledWith(
            'fake query',
            0,
            { limitToProject: 'http://rdfh.ch/projects/0803' }
        );

    });

});
