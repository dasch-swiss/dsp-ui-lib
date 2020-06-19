import { OverlayModule } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockProjects, ProjectsEndpointAdmin } from '@dasch-swiss/dsp-js';
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
        <dsp-fulltext-search #fulltextSearch
            [route]="route"
            [projectfilter]="projectfilter"
            [filterbyproject]="filterbyproject"
            class="kui-fulltext-search">
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
    let fulltextSearchComponentDe;
    let hostCompDe;

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
                FormsModule,
                BrowserAnimationsModule,
                MatMenuModule,
                MatInputModule,
                MatTooltipModule,
                MatIconModule,
                MatDividerModule,
                MatListModule
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

        hostCompDe = testHostFixture.debugElement;
        fulltextSearchComponentDe = hostCompDe.query(By.directive(FulltextSearchComponent));
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

    // TODO: perform a search
    // TODO: reset search
    // TODO: do prev search
    // TODO: reset prev search

    it('should get a menu panel with the list of projects', () => {

        const projButtonDe = fulltextSearchComponentDe.query(By.css('button.kui-project-filter-button'));
        const projButtonNe = projButtonDe.nativeElement;

        expect(projButtonNe).toBeDefined();

        const projBtnLabelDe = projButtonDe.query(By.css('button > p.label'));
        const projBtnLabelNe = projBtnLabelDe.nativeElement;
        console.log('projBtnLabelNe.innerHTML', projBtnLabelNe.innerHTML);

        expect(projBtnLabelNe.innerHTML).toEqual('All projects');

        projButtonNe.click();
        testHostFixture.detectChanges();

        const projMenuPanelDe = projButtonDe.query(By.css('div.mat-menu-panel'));
        const projMenuPanelNe = projMenuPanelDe.nativeElement;

        expect(projMenuPanelNe).toBeDefined();

    });

    it('should select one project in the menu panel', () => {

        const projButtonDe = fulltextSearchComponentDe.query(By.css('button.kui-project-filter-button'));
        const projButtonNe = projButtonDe.nativeElement;

        const projBtnLabelDe = projButtonDe.query(By.css('button > p.label'));
        const projBtnLabelNe = projBtnLabelDe.nativeElement;

        projButtonNe.click();
        testHostFixture.detectChanges();

        const projMenuPanelDe = projButtonDe.query(By.css('div.mat-menu-panel'));
        const projPanelItemDe = projMenuPanelDe.query(By.css('.project-item'));
        const projPanelItemNe = projPanelItemDe.nativeElement;
        spyOn(testHostComponent.fulltextSearch, 'setProject').and.callThrough();
        spyOn(testHostComponent.fulltextSearch, 'changeFocus').and.callThrough();

        projPanelItemNe.click();
        testHostFixture.detectChanges();

        expect(projBtnLabelNe.innerHTML).toEqual('anything');
        expect(testHostComponent.fulltextSearch.setProject).toHaveBeenCalledTimes(1);
        expect(testHostComponent.fulltextSearch.setProject).toHaveBeenCalledWith(testHostComponent.fulltextSearch.projects[0]);
        expect(testHostComponent.fulltextSearch.changeFocus).toHaveBeenCalledTimes(1);

    });

});
