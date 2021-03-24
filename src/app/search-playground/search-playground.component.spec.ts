import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchPlaygroundComponent } from './search-playground.component';
import { Component, Input } from '@angular/core';

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: 'dsp-search-panel',
    template: ``
})
class TestSearchPanelComponent {
    @Input() limitToProject: string;
    @Input() projectfilter: boolean;
    @Input() advanced: boolean;
    @Input() expert: boolean;
}

describe('SearchPlaygroundComponent', () => {
    let component: SearchPlaygroundComponent;
    let fixture: ComponentFixture<SearchPlaygroundComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SearchPlaygroundComponent, TestSearchPanelComponent],
            imports: [
                BrowserAnimationsModule,
                MatCheckboxModule,
                MatExpansionModule,
                MatSlideToggleModule,
                ReactiveFormsModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchPlaygroundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
