import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DspApiConnectionToken } from '../../../core';
import { ListViewComponent, ListViewParam } from './list-view.component';

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
            query: 'kreuz',
            mode: 'fulltext'
        }
    }

    openResource(id: string) {
        this.resIri = id;
    }

}

describe('ListViewComponent', () => {
    let testHostComponent: TestParentComponent;
    let testHostFixture: ComponentFixture<TestParentComponent>;

    beforeEach(async(() => {

        const spyObj = {
            v2: {
                search: jasmine.createSpyObj('search', ['doFulltextSearch', 'doFulltextSearchCountQuery', 'doExtendedSearch', 'doExtendedSearchCountQuery'])
            }
        };

        TestBed.configureTestingModule({
            declarations: [
                ListViewComponent
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

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestParentComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();

        expect(testHostComponent).toBeTruthy();

    });

    it('should create', () => {
        expect(testHostComponent.search).toBeTruthy();

    });
});
