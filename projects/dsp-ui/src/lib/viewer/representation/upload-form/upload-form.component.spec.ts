import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UploadFileService } from '../../services/upload-file.service';

import { UploadFormComponent } from './upload-form.component';

describe('UploadFormComponent', () => {
    let component: UploadFormComponent;
    let fixture: ComponentFixture<UploadFormComponent>;
    class MockUploadFileService {
        envUrl = 'envUrl';
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UploadFormComponent],
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
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display resource type', () => {
        expect(component.resourceTyoe).toBeDefined();
    });

    it('should be created with no fille', () => {
        expect(component.file).toBeFalsy();
    });

    describe('form', () => {
        it('should create form group and file control', () => {
            expect(component.form).toBeDefined();
            expect(component.fileControl).toBeTruthy();
        });

        it('should reset the form', () => {
            const fb = new FormBuilder();
            component.form = fb.group({ test: '' });
            component.resetForm();
            expect(component.form.get('test').value).toBeNull();
        });
    });

    describe('isFileTypeSupported', () => {
        it('should return true for the supported image files', () => {
            const fileTypes = ['image/jpeg', 'image/jp2', 'image/tiff', 'image/tiff-fx', 'image/png'];
            for (const type of fileTypes) {
                expect(component.isFileTypeSupported(type)).toBeTruthy();
            }

        });

        it('should return false for unsupported image files', () => {
            // TODO: add real unsupported filetypes?
            const fileTypes = ['image/a', 'image/b', 'image/c', 'image/d', 'image/e'];
            for (const type of fileTypes) {
                expect(component.isFileTypeSupported(type)).toBeFalsy();
            }

        });
    });
});
