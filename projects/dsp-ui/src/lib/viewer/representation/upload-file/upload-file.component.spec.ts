import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Constants } from '@dasch-swiss/dsp-js';
import { UploadedFileResponse, UploadFileService } from '../../services/upload-file.service';
import { UploadFileComponent } from './upload-file.component';
import { Component, ViewChild } from '@angular/core';

class MockUploadFileService {
    envUrl = 'envUrl';
}

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
    <dsp-upload-file #upload [representation]="representation" (cancelUpload)="uploadCancelled()"></dsp-upload-file>`
})
class TestHostComponent {

    @ViewChild('upload') uploadFileComp: UploadFileComponent;

    representation = Constants.StillImageFileValue;

    upload: UploadedFileResponse;

    uploadCancelledState = false;

    uploadFile(file: UploadedFileResponse) {
        this.upload = file;
    }

    uploadCancelled() {
        this.uploadCancelledState = true;
    }

}


describe('UploadFileComponent', () => {
    const mockFile = new File(['1'], 'testfile');
    const fb = new FormBuilder();

    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UploadFileComponent, TestHostComponent],
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
        testHostFixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostComponent.uploadFileComp).toBeTruthy();
    });

    it('should display resource type', () => {
        expect(testHostComponent.uploadFileComp.representation).toBeDefined();
    });

    it('should be created without a file', () => {
        expect(testHostComponent.uploadFileComp.file).toBeFalsy();
    });

    it('should delete attachment', () => {
        expect(testHostComponent.uploadCancelledState).toBe(false);

        testHostComponent.uploadFileComp.file = mockFile;
        testHostComponent.uploadFileComp.fileControl.setValue(mockFile);
        testHostComponent.uploadFileComp.thumbnailUrl = 'test';
        testHostComponent.uploadFileComp.deleteAttachment();
        expect(testHostComponent.uploadFileComp.file).toBeNull();
        expect(testHostComponent.uploadFileComp.fileControl.value).toBeNull();
        expect(testHostComponent.uploadFileComp.thumbnailUrl).toBeNull();

        expect(testHostComponent.uploadCancelledState).toBe(true);
    });

    describe('form', () => {
        it('should create form group and file control', () => {
            expect(testHostComponent.uploadFileComp.form).toBeDefined();
            expect(testHostComponent.uploadFileComp.fileControl).toBeTruthy();
        });

        it('should reset the form', () => {
            testHostComponent.uploadFileComp.form = fb.group({ test: '' });
            testHostComponent.uploadFileComp.resetForm();
            expect(testHostComponent.uploadFileComp.form.get('test').value).toBeNull();
        });
    });

    describe('isFileTypeSupported', () => {
        it('should return true for the supported image files', () => {
            const fileTypes = ['image/jpeg', 'image/jp2', 'image/tiff', 'image/tiff-fx', 'image/png'];

            for (const type of fileTypes) {
                expect(testHostComponent.uploadFileComp['_isFileTypeSupported'](type)).toBeTruthy();
            }
        });

        it('should return false for unsupported image files', () => {
            // TODO: add real unsupported filetypes?
            const fileTypes = ['image/a', 'image/b', 'image/c', 'image/d', 'image/e'];
            for (const type of fileTypes) {
                expect(testHostComponent.uploadFileComp['_isFileTypeSupported'](type)).toBeFalsy();
            }
        });
    });

    describe('isMoreThanOneFile', () => {
        it('should return false for one file array', () => {
            const filesArray: File[] = [];
            filesArray.push(mockFile);
            expect(testHostComponent.uploadFileComp['_isMoreThanOneFile'](filesArray)).toBeFalsy();
        });

        it('should return false for more than one file', () => {
            const filesArray: File[] = [];
            filesArray.push(mockFile, mockFile, mockFile);
            expect(testHostComponent.uploadFileComp['_isMoreThanOneFile'](filesArray)).toBeTruthy();
        });
    });
});
