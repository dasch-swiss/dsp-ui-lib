import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../action/services/notification.service';
import { UploadedFileResponse, UploadFileService } from '../../services/upload-file.service';

@Component({
    selector: 'dsp-upload-form',
    templateUrl: './upload-form.component.html',
    styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {

    @Input() readonly resourceTyoe = 'Image'; // only StillImageRepresentation supported so far
    @Output() file: File;

    readonly fromLabels = {
        upload: 'Upload file',
        drag_drop: 'Drag and drop or click to upload'
    };
    form: FormGroup;
    get fileControl() { return this.form.get('file') as FormControl; }
    isLoading = false;
    thumbnaillUrl: string;

    constructor(
        private readonly _fb: FormBuilder,
        private readonly _ns: NotificationService,
        private readonly _ufs: UploadFileService
    ) {}

    ngOnInit(): void {
        this.initializeForm();
    }

    initializeForm(): void {
        this.form = this._fb.group({
            file: [undefined, Validators.required]
        }, {updateOn: 'blur'});
    }

    addFile(event): void {
        let files: File[] = [];
        files = event.target?.files ? event.target.files : event;
        if (this.isMoreThanOneFile(files)) {
            const error = 'ERROR: Only one file allowed at a time';
            this._ns.openSnackBar(error);
            this.file = null;
        } else {
            const formData = new FormData();
            this.file = files[0];
            if (!this.isFileTypeSupported(this.file.type)) {
                const error = 'ERROR: File type not supported';
                this._ns.openSnackBar(error);
                this.file = null;
            } else {
                // show loading indicator only for files > 1MB
                this.isLoading = this.file.size > 1048576 ? true : false;
                formData.append(this.file.name, this.file);
                this._ufs.upload(formData).subscribe(
                    (res: UploadedFileResponse) => {
                        const tempUrl = res.uploadedFiles[0].temporaryUrl;
                        const thumbUri = `${tempUrl}/full/150,/0/default.jpg`;
                        this.thumbnaillUrl = `${thumbUri}`.replace('http://sipi:1024/', this._ufs.envUrl);
                        console.log(res);
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
        console.log('addFile', event, this.file, this.fileControl);
    }

    resetForm(): void {
        this.form.reset();
    }

    isFileTypeSupported(param: string): boolean {
        return this.supportedFileTypes().includes(param) ? true : false;
    }

    supportedFileTypes(): string[] {
        let allowedFileTypes: string[];
        switch (this.resourceTyoe) {
            case 'Image':
                allowedFileTypes = ['image/jpeg', 'image/jp2', 'image/tiff', 'image/tiff-fx', 'image/png'];
                break;
            default:
                allowedFileTypes = [];
                break;
        }
        return allowedFileTypes;
    }

    isMoreThanOneFile(files: File[]): boolean {
        return files.length > 1;
    }

    deleteAttachment(i?: number): void {
        // this.files.splice(i, 1);
        this.file = null;
        this.thumbnaillUrl = null;
        this.fileControl.reset();
    }

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

    convertDate(val: number): string {
        return new Date(+`Date(${val})`.replace(/\D/g, '')).toLocaleDateString();
    }

}
