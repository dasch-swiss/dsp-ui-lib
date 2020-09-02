import { OverlayModule } from '@angular/cdk/overlay';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { SearchPanelComponent } from './search-panel.component';

/**
 * Test host component to simulate child component, here fulltext-search.
 */
@Component({
    selector: `dsp-fulltext-search`
})
class TestFulltextSearchComponent implements OnInit {

    @Input() projectfilter?: boolean = false;
    @Input() filterbyproject?: string;
    @Input() show: boolean;
    @Output() showState = new EventEmitter();

    ngOnInit() { }
}

/**
 * Test host component to simulate parent component with a search panel.
 */
@Component({
    template: `
        <dsp-search-panel #searchPanelView
            [projectfilter]="projectfilter"
            [expert]="expert"
            [advanced]="advanced">
        </dsp-search-panel>`
})
class TestHostComponent {

    @ViewChild('searchPanelView') searchPanelComponent: SearchPanelComponent;

    projectfilter = true;
    advanced = false;
    expert = false;

}

describe('SearchPanelComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SearchPanelComponent,
                TestHostComponent,
                TestFulltextSearchComponent
            ],
            imports: [
                OverlayModule,
                MatMenuModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();

        expect(testHostComponent).toBeTruthy();
    });

    it('should create an instance', () => {
        expect(testHostComponent.searchPanelComponent).toBeTruthy();
    });

});
