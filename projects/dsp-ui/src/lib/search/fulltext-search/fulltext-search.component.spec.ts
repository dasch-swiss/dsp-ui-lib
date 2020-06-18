import { OverlayModule } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockResource } from '@dasch-swiss/dsp-js';
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

    route: string = '/search';
    projectfilter: boolean = false;
    filterbyproject?: string;

    ngOnInit() {
        MockResource.getTestthing().subscribe(res => {
            console.log('res', res);
            this.filterbyproject = res.attachedToProject;
        });
    }

}


describe('FulltextSearchComponent', () => {
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
        /* const dspConnSpy = TestBed.inject(DspApiConnectionToken);

        (dspConnSpy.admin.projectsEndpoint as jasmine.SpyObj<ProjectsEndpointAdmin>).getProjectByIri.and.callFake(
            (projIri: string) => {

                // create fake data and return project

            }
        ); */

        testHostFixture = TestBed.createComponent(TestHostFulltextSearchComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostComponent.fulltextSearchComponent).toBeTruthy();
    });
});
