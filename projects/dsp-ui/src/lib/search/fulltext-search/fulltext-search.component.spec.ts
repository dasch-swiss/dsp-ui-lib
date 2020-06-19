import { OverlayModule } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
    selector: `lib-host-component`,
    template: `
        <dsp-fulltext-search #fulltextSearch class="kui-fulltext-search"[route]="route"[projectfilter]="projectfilter"
        [filterbyproject]="filterbyproject" >
            </dsp-fulltext-search>
    `
})
class TestHostFulltextSearchComponent implements OnInit {

    @ViewChild('fulltextSearch') fulltextSearchComponent: FulltextSearchComponent;

    sortingService: SortingService = new SortingService();

    route = '/search';
    projectfilter?: boolean = true;
    filterbyproject?: string;

    projects: ReadProject[];

    ngOnInit() {
        console.log(MockProjects.mockProjects());
        /* if (this.projectfilter) {
            this.getAllProjects();
        } */
    }

    getAllProjects() {
        // get all mocked projects sorted by alphabetical order
        // this.projects = this.sortingService.keySortByAlphabetical(MockProjects.mockProjects().body.projects, 'shortname');
    }

}

fdescribe('FulltextSearchComponent', () => {
    let testHostComponent: TestHostFulltextSearchComponent;
    let testHostFixture: ComponentFixture<TestHostFulltextSearchComponent>;

    const dspConnSpy = {
        admin: {
            projects: jasmine.createSpyObj('projectsEndpoint', ['getProjects']),
            projByIri: jasmine.createSpyObj('projectsEndpoint', ['getProjectByIri'])
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
                RouterTestingModule
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

    fit('should create', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostComponent.fulltextSearchComponent).toBeTruthy();
    });
});
