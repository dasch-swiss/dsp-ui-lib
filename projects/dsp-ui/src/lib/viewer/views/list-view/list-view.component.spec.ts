import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DspApiConnectionToken } from '../../../core';
import { ListViewComponent, ListViewParam } from './list-view.component';
import { SearchEndpointV2, CountQueryResponse } from '@dasch-swiss/dsp-js';
import { of } from 'rxjs';

/**
 * Test host component to simulate child component, here resource-list.
 */
@Component({
    selector: `dsp-list-view`,
    template: ``
})
class TestResourceListComponent {

    @Input() search: ListViewParam;

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

    search: ListViewParam;

    resIri: string;

    ngOnInit() {

        this.search = {
            query: 'mann',
            mode: 'fulltext',
            params: {
                limitToProject: 'http://rdfh.ch/projects/0803'
            }
        };
    }

    openResource(id: string) {
        this.resIri = id;
    }

}

fdescribe('ListViewComponent', () => {


    beforeEach(async(() => {

        const spyObj = {
            v2: {
                search: jasmine.createSpyObj('search', ['doFulltextSearch', 'doFulltextSearchCountQuery', 'doExtendedSearch', 'doExtendedSearchCountQuery'])
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
                    useValue: spyObj
                }
            ]
        })
            .compileComponents();
    }));

    describe('display list of resources', () => {
        let testHostComponent: TestParentComponent;
        let testHostFixture: ComponentFixture<TestParentComponent>;

        beforeEach(() => {
            testHostFixture = TestBed.createComponent(TestParentComponent);
            testHostComponent = testHostFixture.componentInstance;
            testHostFixture.detectChanges();

            expect(testHostComponent).toBeTruthy();

        });

        it('should do fulltext search', () => {
            const valuesSpy = TestBed.inject(DspApiConnectionToken);

            (valuesSpy.v2.search as jasmine.SpyObj<SearchEndpointV2>).doFulltextSearchCountQuery.and.callFake(
                () => {
                    const num = new CountQueryResponse();
                    num.numberOfResults = 101;
                    return of(num);
                }
            );

            // simulate user searching for label 'thing'
            testHostComponent.search.query = 'mann';
            testHostComponent.search.mode = 'fulltext';
            testHostComponent.search.params.limitToProject = 'http://rdfh.ch/projects/0803'

            expect(valuesSpy.v2.search.doFulltextSearchCountQuery).toHaveBeenCalledWith('mann', 0, { limitToProject: 'http://rdfh.ch/projects/0803' });
            //   expect(testHostComponent.inputValueComponent.resources.length).toEqual(1);
            //   expect(testHostComponent.inputValueComponent.resources[0].id).toEqual('http://rdfh.ch/0001/IwMDbs0KQsaxSRUTl2cAIQ');

            // {
            //     "schema:numberOfItems" : 2,
            //     "@context" : {
            //       "schema" : "http://schema.org/"
            //     }
            //   }
        });
    });
});
