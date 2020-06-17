import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { SearchResultsComponent } from './search-results.component';


describe('SearchResultsComponent', () => {
    let component: SearchResultsComponent;
    let fixture: ComponentFixture<SearchResultsComponent>;

    const mode = 'fulltext';
    const project = 'http://rdfh.ch/projects/0001'; // project iri
    const q = 'thing'; // query terms

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SearchResultsComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of({
                            get: (param: string) => {
                                if (param === 'q') {
                                    return q;
                                } else if (param === 'project') {
                                    if (project !== undefined) {
                                        return project;
                                    } else {
                                        return null;
                                    }
                                } else {
                                    return mode;
                                }
                            }
                        })
                    }
                },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
