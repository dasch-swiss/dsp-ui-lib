import { OverlayModule } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { MockProjects, ProjectsEndpointAdmin, ReadProject } from '@dasch-swiss/dsp-js';
import { of } from 'rxjs/internal/observable/of';
import { SortingService } from '../../action/services/sorting.service';
import { DspApiConnectionToken } from '../../core';
import { FulltextSearchComponent } from './fulltext-search.component';

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `dsp-host-component`,
    template: `
        <dsp-fulltext-search #fulltextSearch class="kui-fulltext-search"[route]="route"[projectfilter]="projectfilter"
        [filterbyproject]="filterbyproject" >
            </dsp-fulltext-search>
    `
})
class TestHostFulltextSearchComponent implements OnInit {

    @ViewChild('fulltextSearch') fulltextSearch: FulltextSearchComponent;

    sortingService: SortingService = new SortingService();

    route = '/search';
    projectfilter?: boolean = true;
    filterbyproject?: string;

    ngOnInit() {
        console.log(MockProjects.mockProjects());
    }

}

describe('FulltextSearchComponent', () => {
    let testHostComponent: TestHostFulltextSearchComponent;
    let testHostFixture: ComponentFixture<TestHostFulltextSearchComponent>;

    const dspConnSpy = {
        admin: {
            projectsEndpoint: jasmine.createSpyObj('projectsEndpoint', ['getProjects', 'getProjectByIri'])
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FulltextSearchComponent,
                TestHostFulltextSearchComponent
            ],
            imports: [
                OverlayModule,
                RouterTestingModule,
                MatMenuModule
            ],
            providers: [
                {
                    provide: DspApiConnectionToken,
                    useValue: dspConnSpy
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {

        const valuesSpy = TestBed.inject(DspApiConnectionToken);

        (valuesSpy.admin.projectsEndpoint as jasmine.SpyObj<ProjectsEndpointAdmin>).getProjects.and.callFake(
            () => {
                const projects = MockProjects.mockProjects();
                return of(projects);
            }
        );

        testHostFixture = TestBed.createComponent(TestHostFulltextSearchComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostComponent.fulltextSearch).toBeTruthy();
    });

    it('should get projects on init', () => {
        const projSpy = TestBed.inject(DspApiConnectionToken);

        expect(testHostComponent.fulltextSearch.projects).toBeDefined();
        expect(testHostComponent.fulltextSearch.projects.length).toEqual(8);
        expect(testHostComponent.fulltextSearch.projectfilter).toEqual(true);

        expect(projSpy.admin.projectsEndpoint.getProjects).toHaveBeenCalledTimes(2);

    });

});
