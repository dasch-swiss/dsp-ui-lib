import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UploadFormComponent } from '../representation/upload-form/upload-form.component';
import { UploadFileService } from '../services/upload-file.service';
import { DragDropDirective } from './drag-drop.directive';

class MockUploadFileService { }

describe('DragDropDirective', () => {
    let component: UploadFormComponent;
    let fixture: ComponentFixture<UploadFormComponent>;
    let dragDropInput: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UploadFormComponent, DragDropDirective],
            imports: [
                BrowserAnimationsModule,
                MatIconModule,
                MatInputModule,
                MatSnackBarModule,
                ReactiveFormsModule
            ],
            providers: [
                { provide: UploadFileService, useClass: MockUploadFileService }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        dragDropInput = fixture.debugElement.query(By.css('.dd-container'));
    });

    it('should create an instance', () => {
        const directive = new DragDropDirective();
        expect(directive).toBeTruthy();
    });

    it('should change background-color of input on dragover event', () => {
        const dragOver = new DragEvent('dragover');
        const color = 'rgb(221, 221, 221)'; // = #ddd
        spyOn(dragOver, 'preventDefault');
        spyOn(dragOver, 'stopPropagation');
        dragDropInput.triggerEventHandler('dragover', dragOver);
        fixture.detectChanges();
        expect(dragDropInput.nativeElement.style.backgroundColor).toBe(color);
        expect(dragOver.stopPropagation).toHaveBeenCalled();
        expect(dragOver.preventDefault).toHaveBeenCalled();
    });

    it('should change background-color of input on dragleave event', () => {
        const dragLeave = new DragEvent('dragleave');
        const color = 'rgb(242, 242, 242)'; // = #f2f2f2
        spyOn(dragLeave, 'preventDefault');
        spyOn(dragLeave, 'stopPropagation');
        dragDropInput.triggerEventHandler('dragleave', dragLeave);
        fixture.detectChanges();
        expect(dragDropInput.nativeElement.style.backgroundColor).toBe(color);
        expect(dragLeave.stopPropagation).toHaveBeenCalled();
        expect(dragLeave.preventDefault).toHaveBeenCalled();
    });

    it('should change background-color of input on drop event', () => {
        const mockFile = new File(['1'], 'testfile');
        const drop = new DragEvent('drop');
        const color = 'rgb(242, 242, 242)'; // = #f2f2f2
        spyOn(drop, 'preventDefault');
        spyOn(drop, 'stopPropagation');
        dragDropInput.triggerEventHandler('drop', drop);
        fixture.detectChanges();
        expect(dragDropInput.nativeElement.style.backgroundColor).toBe(color);
        expect(drop.stopPropagation).toHaveBeenCalled();
        expect(drop.preventDefault).toHaveBeenCalled();
    });
});
