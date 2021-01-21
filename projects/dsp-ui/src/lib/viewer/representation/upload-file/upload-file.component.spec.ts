import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Constants } from '@dasch-swiss/dsp-js';
import { UploadFileService } from '../../services/upload-file.service';
import { UploadFileComponent } from './upload-file.component';

class MockUploadFileService {
    envUrl = 'envUrl';
}

describe('UploadFileComponent', () => {
    const mockFile = new File(['1'], 'testfile');
    const fb = new FormBuilder();
    let component: UploadFileComponent;
    let fixture: ComponentFixture<UploadFileComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UploadFileComponent],
            imports: [
                MatInputModule,
                MatSnackBarModule,
                ReactiveFormsModule,
                MatIconModule
            ],
            providers: [
                { provide: UploadFileService, useClass: MockUploadFileService }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadFileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display resource type', () => {
        expect(component.representation).toBeUndefined();
    });

    it('should be created with no fille', () => {
        expect(component.file).toBeFalsy();
    });

    it('should delete attachement', () => {
        component.file = mockFile;
        component.fileControl.setValue(mockFile);
        component.thumbnailUrl = 'test';
        component.deleteAttachment();
        expect(component.file).toBeNull();
        expect(component.fileControl.value).toBeNull();
        expect(component.thumbnailUrl).toBeNull();
    });

    describe('form', () => {
        it('should create form group and file control', () => {
            expect(component.form).toBeDefined();
            expect(component.fileControl).toBeTruthy();
        });

        it('should reset the form', () => {
            component.form = fb.group({ test: '' });
            component.resetForm();
            expect(component.form.get('test').value).toBeNull();
        });
    });

    describe('isFileTypeSupported', () => {
        it('should return true for the supported image files', () => {
            const fileTypes = ['image/jpeg', 'image/jp2', 'image/tiff', 'image/tiff-fx', 'image/png'];
            component.representation = Constants.StillImageFileValue;
            for (const type of fileTypes) {
                expect(component['_isFileTypeSupported'](type)).toBeTruthy();
            }
        });

        it('should return false for unsupported image files', () => {
            // TODO: add real unsupported filetypes?
            const fileTypes = ['image/a', 'image/b', 'image/c', 'image/d', 'image/e'];
            for (const type of fileTypes) {
                expect(component['_isFileTypeSupported'](type)).toBeFalsy();
            }
        });
    });

    describe('isMoreThanOneFile', () => {
        it('should return false for one file array', () => {
            const filesArray: File[] = [];
            filesArray.push(mockFile);
            expect(component['_isMoreThanOneFile'](filesArray)).toBeFalsy();
        });

        it('should return false for more than one file', () => {
            const filesArray: File[] = [];
            filesArray.push(mockFile, mockFile, mockFile);
            expect(component['_isMoreThanOneFile'](filesArray)).toBeTruthy();
        });
    });
});
