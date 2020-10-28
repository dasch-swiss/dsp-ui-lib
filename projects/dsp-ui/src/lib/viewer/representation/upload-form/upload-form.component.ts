import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../action';
import { UploadedFileResponse, UploadFileService } from '../../services/upload-file.service';

@Component({
    selector: 'dsp-upload-form',
    templateUrl: './upload-form.component.html',
    styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {

    readonly resourceTyoe = 'Image'; // only StillImageRepresentation supported so far
    readonly fromLabels = {
        drag_drop: {
            upload: 'Upload file',
            drop_or_upload: 'Drag and drop or click to upload'
        },
        title: 'Title',
        description: 'Description',
        date: 'Creation Date',
        duration: 'Duration', // TODO: for image?
        person: 'Person', // author??
        location: 'Location',
        transcript: 'Transcript',
        reset: 'Reset',
        save: 'Save'
    };
    form: FormGroup;
    get fileControl() { return this.form.get('file') as FormControl; }
    get titlesArray() { return this.form.get('titles') as FormArray; }
    get personsArray() { return this.form.get('persons') as FormArray; }
    file: File;
    fileTempUrl: string;

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
            file: [undefined, Validators.required],
            titles: this._fb.array([
                this._fb.control('')
            ]),
            description: [null, Validators.required],
            date: ['', Validators.required],
            duration: ['', Validators.required],
            persons: this._fb.array([
                this._fb.control('')
            ]),
            location: ['', Validators.required],
            transcript: ['', Validators.required]
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
            formData.append(this.file.name, this.file);
            this._ufs.upload(formData).subscribe(
                (res: UploadedFileResponse) => {
                    console.log(res);
                    // this.fileTempUrl = res.uploadedFiles[0].temporaryUrl;
                },
                (e: Error) => this._ns.openSnackBar(e.message)
            );
        }
        this.fileControl.setValue(this.file);
        console.log('addFile', event, this.file, this.fileControl);
    }

    onSubmit(): void {
        console.log(this.form);
        this._ufs.upload(this.form.value);
        this.resetForm();
    }

    addTitle(): void {
        this.titlesArray.push(this._fb.control(''));
    }

    addPerson(): void {
        this.personsArray.push(this._fb.control(''));
        // this.personsArray.insert(this.personsArray.length + 1, this._fb.control(''));
    }

    resetForm(): void {
        this.form.reset();
        this.resetFormArray(this.titlesArray);
        this.resetFormArray(this.personsArray);
    }

    resetFormArray(a: FormArray): void {
        while (a.length > 1) {
            a.removeAt(1);
        }
    }

    isMoreThanOneFile(files: File[]): boolean {
        return files.length > 1;
    }

    deleteAttachment(i?: number): void {
        // this.files.splice(i, 1);
        this.file = null;
        this.fileTempUrl = null;
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
