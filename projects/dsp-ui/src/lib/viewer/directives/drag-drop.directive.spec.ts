import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { UploadFormComponent } from '../representation/upload-form/upload-form.component';
import { UploadFileService } from '../services/upload-file.service';
import { DragDropDirective } from './drag-drop.directive';

describe('DragDropDirective', () => {
    let component: UploadFormComponent;
    let fixture: ComponentFixture<UploadFormComponent>;
    let dragDropInput: DebugElement;
    class MockUploadFileService {
        envUrl = 'envUrl';
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UploadFormComponent, DragDropDirective],
            imports: [
                MatInputModule,
                MatSnackBarModule
            ],
            providers: [
                UploadFormComponent,
                FormBuilder,
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
        const dragOver = new DragEvent('dragover', null);
        const color = 'rgb(221, 221, 221)'; // = #ddd
        spyOn(dragOver, 'preventDefault');
        spyOn(dragOver, 'stopPropagation');
        dragDropInput.triggerEventHandler('dragover', null);

        const element = document.querySelector('.dd-container');
        element.dispatchEvent(dragOver);
        fixture.detectChanges();
        expect(dragDropInput.nativeElement.style.backgroundColor).toBe(color);
        expect(dragOver.stopPropagation).toHaveBeenCalled();
        expect(dragOver.preventDefault).toHaveBeenCalled();
    });

    it('should change background-color of input on dragleave event', () => {
        const color = 'rgb(242, 242, 242)'; // = #f2f2f2
        dragDropInput.triggerEventHandler('dragleave', null);
        fixture.detectChanges();
        console.log('off', dragDropInput.nativeElement.style.backgroundColor);
        expect(dragDropInput.nativeElement.style.backgroundColor).toBe(color);
    });

    it('should change background-color of input on drop event', () => {
        const color = 'rgb(242, 242, 242)'; // = #f2f2f2
        dragDropInput.triggerEventHandler('drop', null);
        fixture.detectChanges();
        console.log('drop', dragDropInput.nativeElement.style.backgroundColor);
        expect(dragDropInput.nativeElement.style.backgroundColor).toBe(color);
    });
});
