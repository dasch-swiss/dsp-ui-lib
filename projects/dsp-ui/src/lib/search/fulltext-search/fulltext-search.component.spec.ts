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
    }

}

interface PrevSearchItem {
    projectIri?: string;
    projectLabel?: string;
    query: string;
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

    // Mock localStorage
    beforeEach(() => {
        let store = {};

        spyOn(localStorage, 'getItem').and.callFake((key: string): string => {
            return store[key] || null;
        });
        spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
            delete store[key];
        });
        spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string => {
            return store[key] = value as string;
        });
        spyOn(localStorage, 'clear').and.callFake(() => {
            store = {};
        });
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

        expect(projSpy.admin.projectsEndpoint.getProjects).toHaveBeenCalledTimes(1);

    });

    it('should do a search', () => {
        const searchBtn = fulltextSearchComponentDe.query(By.css('button.kui-fulltext-search-button'));
        expect(searchBtn).toBeDefined();
        const searchInput = fulltextSearchComponentDe.query(By.css('input.kui-fulltext-search-input')).nativeElement;
        expect(searchInput).toBeDefined();

        spyOn(testHostComponent.fulltextSearch, 'doSearch');

        searchInput.value = 'thing';
        searchInput.dispatchEvent(new Event('input'));

        // click on the search button and trigger the method doSearch()
        searchBtn.triggerEventHandler('click', null);
        // another possible click trigger: searchInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }))
        testHostFixture.detectChanges();

        expect(testHostComponent.fulltextSearch.searchQuery).toEqual('thing');
        expect(testHostComponent.fulltextSearch.doSearch).toHaveBeenCalled();
        expect(testHostComponent.fulltextSearch.doSearch).toHaveBeenCalledTimes(1);

        // todo: add a check on the local storage
    });

    it('should reset the current search', () => {
        const searchInput = fulltextSearchComponentDe.query(By.css('input.kui-fulltext-search-input')).nativeElement;
        expect(searchInput).toBeDefined();

        spyOn(testHostComponent.fulltextSearch, 'resetSearch');

        searchInput.value = 'thing';

        searchInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Esc' }));

        testHostFixture.detectChanges();

        expect(testHostComponent.fulltextSearch.searchQuery).toEqual(undefined);
        expect(testHostComponent.fulltextSearch.resetSearch).toHaveBeenCalled();
        expect(testHostComponent.fulltextSearch.resetSearch).toHaveBeenCalledTimes(1);
    });

    it('should perform a search with a previous item', () => {
        const prevSearchArray: PrevSearchItem[] = [
            { projectIri: 'http://rdfh.ch/projects/0803', projectLabel: 'incunabula', query: 'thing' },
            { projectIri: 'http://rdfh.ch/projects/0801', projectLabel: 'anything', query: 'blue thing' }
        ];

        const prevSearchStorage = localStorage.setItem('prevSearch', JSON.stringify(prevSearchArray));
        expect(prevSearchStorage).toBeDefined();

        spyOn(testHostComponent.fulltextSearch, 'doPrevSearch');

        // click in the search input to open the search panel
        const searchInput = fulltextSearchComponentDe.query(By.css('input.kui-fulltext-search-input')).nativeElement;
        expect(searchInput).toBeDefined();
        searchInput.click();
        testHostFixture.detectChanges();

        const searchMenuPanel = fulltextSearchComponentDe.query(By.css('div.kui-search-menu')).nativeElement;
        expect(searchMenuPanel).toBeDefined();

        const prevSearchItem = fulltextSearchComponentDe.query(By.css('div.kui-previous-search-query')).nativeElement;
        prevSearchItem.click();
        testHostFixture.detectChanges();

        expect(testHostComponent.fulltextSearch.doPrevSearch).toHaveBeenCalled();
        expect(testHostComponent.fulltextSearch.doPrevSearch).toHaveBeenCalledWith(prevSearchArray[1]);
        expect(testHostComponent.fulltextSearch.doPrevSearch).toHaveBeenCalledTimes(1);

    });


    it('should clear the search list', () => {
        const prevSearchArray: PrevSearchItem[] = [
            { projectIri: 'http://rdfh.ch/projects/0803', projectLabel: 'incunabula', query: 'thing' },
            { projectIri: 'http://rdfh.ch/projects/0801', projectLabel: 'anything', query: 'blue thing' }
        ];

        const prevSearchStorage = localStorage.setItem('prevSearch', JSON.stringify(prevSearchArray));
        expect(prevSearchStorage).toBeDefined();

        spyOn(testHostComponent.fulltextSearch, 'resetPrevSearch');

        // click in the search input to open the search panel
        const searchInput = fulltextSearchComponentDe.query(By.css('input.kui-fulltext-search-input')).nativeElement;
        expect(searchInput).toBeDefined();
        searchInput.click();
        testHostFixture.detectChanges();

        // click on the Clear List button to erase the search list
        const clearListBtn = fulltextSearchComponentDe.query(By.css('button.clear-list-btn')).nativeElement;
        expect(clearListBtn).toBeDefined();
        clearListBtn.click();
        testHostFixture.detectChanges();

        expect(testHostComponent.fulltextSearch.resetPrevSearch).toHaveBeenCalled();
        expect(testHostComponent.fulltextSearch.resetPrevSearch).toHaveBeenCalledTimes(1);
        // todo: expect(prevSearchStorage).toBeUndefined();


    });

    it('should remove one item of the search list', () => {
        const prevSearchArray: PrevSearchItem[] = [
            { projectIri: 'http://rdfh.ch/projects/0803', projectLabel: 'incunabula', query: 'one thing' }
        ];

        const prevSearchStorage = localStorage.setItem('prevSearch', JSON.stringify(prevSearchArray));
        expect(prevSearchStorage).toBeDefined();

        spyOn(testHostComponent.fulltextSearch, 'resetPrevSearch');

        // click in the search input to open the search panel
        const searchInput = fulltextSearchComponentDe.query(By.css('input.kui-fulltext-search-input')).nativeElement;
        expect(searchInput).toBeDefined();
        searchInput.click();
        testHostFixture.detectChanges();

        // click on the close icon to remove the item of the list
        const closeItemBtn = fulltextSearchComponentDe.query(By.css('mat-icon.mat-list-close-icon')).nativeElement;
        expect(closeItemBtn).toBeDefined();
        closeItemBtn.click();
        testHostFixture.detectChanges();

        expect(testHostComponent.fulltextSearch.resetPrevSearch).toHaveBeenCalled();
        expect(testHostComponent.fulltextSearch.resetPrevSearch).toHaveBeenCalledTimes(1);
        expect(testHostComponent.fulltextSearch.resetPrevSearch).toHaveBeenCalledWith(prevSearchArray[0]);

        // todo: expect(prevSearchStorage).toBeUndefined();

    });

    it('should get a menu panel with the list of projects', () => {

        const projButtonDe = fulltextSearchComponentDe.query(By.css('button.kui-project-filter-button'));
        const projButtonNe = projButtonDe.nativeElement;

        expect(projButtonNe).toBeDefined();

        const projBtnLabelDe = projButtonDe.query(By.css('button > p.label'));
        const projBtnLabelNe = projBtnLabelDe.nativeElement;

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
        expect(testHostComponent.fulltextSearch.setProject).toHaveBeenCalled();
        expect(testHostComponent.fulltextSearch.setProject).toHaveBeenCalledTimes(1);
        expect(testHostComponent.fulltextSearch.setProject).toHaveBeenCalledWith(testHostComponent.fulltextSearch.projects[0]);

        expect(testHostComponent.fulltextSearch.changeFocus).toHaveBeenCalled();
        expect(testHostComponent.fulltextSearch.changeFocus).toHaveBeenCalledTimes(1);

    });

    afterEach(() => {
        fulltextSearchComponentDe.nativeElement.remove();
        testHostFixture.destroy();
    });

});
