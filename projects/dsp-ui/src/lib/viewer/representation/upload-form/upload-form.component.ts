import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../action/services/notification.service';
import { UploadedFileResponse, UploadFileService } from '../../services/upload-file.service';

@Component({
    selector: 'dsp-upload-form',
    templateUrl: './upload-form.component.html',
    styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {

    readonly fromLabels = {
        upload: 'Upload file',
        drag_drop: 'Drag and drop or click to upload'
    };
    readonly resourceTyoe = 'Image';
    file: File; // only StillImageRepresentation supported so far
    form: FormGroup;
    get fileControl() { return this.form.get('file') as FormControl; }
    isLoading = false;
    thumbnaillUrl: string;

    constructor(
        private readonly _fb: FormBuilder,
        private readonly _ns: NotificationService,
        private readonly _ufs: UploadFileService
    ) { }

    ngOnInit(): void {
        this.initializeForm();
    }

    /**
     * Adds file and uploads to SIPI, checking before if conditions met
     * @param event Drag
     */
    addFile(event: any): void {
        let files: File[] = [];
        files = event.target?.files ? event.target.files : event;

        // only one file at a time supported
        if (this._isMoreThanOneFile(files)) {
            const error = 'ERROR: Only one file allowed at a time';
            this._ns.openSnackBar(error);
            this.file = null;
        } else {
            const formData = new FormData();
            this.file = files[0];

            // only certain filetypes are supported
            if (!this._isFileTypeSupported(this.file.type)) {
                const error = 'ERROR: File type not supported';
                this._ns.openSnackBar(error);
                this.file = null;
            } else {
                // show loading indicator only for files > 1MB
                this.isLoading = this.file.size > 1048576 ? true : false;

                formData.append(this.file.name, this.file);
                this._ufs.upload(formData).subscribe(
                    (res: UploadedFileResponse) => {
                        const temporaryUrl = res.uploadedFiles[0].temporaryUrl;
                        const thumbnailUri = '/full/150,/0/default.jpg';
                        this.thumbnaillUrl = `${temporaryUrl}${thumbnailUri}`;
                    },
                    (e: Error) => {
                        this._ns.openSnackBar(e.message);
                        this.isLoading = false;
                        this.file = null;
                        this.thumbnaillUrl = null;
                    },
                    () => {
                        this.fileControl.setValue(this.file);
                        this.isLoading = false;
                    }
                );
            }

        }
    }

    /**
     * Converst file size to display in KM or MB
     * @param (val)
     */
    convertBytes(val: number): string {
        const kilo = 1024;
        const mega = kilo * kilo;
        let result: number;

        if (val >= mega) {
            result = val / mega;
            return `${result.toFixed(2)} MB`;
        } else {
            result = val / kilo;
            return `${result.toFixed(2)} KB`;
        }
    }

    /**
     * Converts date to readable format
     * @param (val)
     */
    convertDate(val: number): string {
        return new Date(+`Date(${val})`.replace(/\D/g, '')).toLocaleDateString();
    }

    /**
     * Removes the attachement
     */
    deleteAttachment(): void {
        this.file = null;
        this.thumbnaillUrl = null;
        this.fileControl.reset();
    }

    /**
     * Initializes form group
     */
    initializeForm(): void {
        this.form = this._fb.group({
            file: [null, Validators.required]
        }, { updateOn: 'blur' });
    }

    /**
     * Resets form group
     */
    resetForm(): void {
        this.form.reset();
    }

    /**
     * Checks if added file type is supported for certain resource type
     * @param (fileType)
     */
    private _isFileTypeSupported(fileType: string): boolean {
        return this._supportedFileTypes().includes(fileType) ? true : false;
    }

    /**
     * Returns supported file types list for certain resource type
     */
    private _supportedFileTypes(): string[] {
        const supportedImageTypes = ['image/jpeg', 'image/jp2', 'image/tiff', 'image/tiff-fx', 'image/png'];
        let allowedFileTypes: string[];
        switch (this.resourceTyoe) {
            case 'Image':
                allowedFileTypes = supportedImageTypes;
                break;
            default:
                allowedFileTypes = [];
                break;
        }
        return allowedFileTypes;
    }

    /**
     * Checks if more than one file dropped
     * @param (files)
     */
    private _isMoreThanOneFile(files: File[]): boolean {
        return files.length > 1;
    }
}
