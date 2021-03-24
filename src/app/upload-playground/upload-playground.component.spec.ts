import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPlaygroundComponent } from './upload-playground.component';
import { Component, Input } from '@angular/core';

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: 'dsp-upload-file',
    template: ``
})
class TestFileUploadComponent {
    @Input() representation: string;
}

describe('UploadPlaygroundComponent', () => {
    let component: UploadPlaygroundComponent;
    let fixture: ComponentFixture<UploadPlaygroundComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [UploadPlaygroundComponent, TestFileUploadComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadPlaygroundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
