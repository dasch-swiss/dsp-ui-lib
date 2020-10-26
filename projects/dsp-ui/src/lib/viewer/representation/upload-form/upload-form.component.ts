import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../action';

@Component({
    selector: 'dsp-upload-form',
    templateUrl: './upload-form.component.html',
    styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {

    resourceTyoe = 'Interview';
    form: FormGroup;
    get fileControl() { return this.form.get('file') as FormControl; }
    get titlesArray() { return this.form.get('titles') as FormArray; }
    get personsArray() { return this.form.get('persons') as FormArray; }
    readonly fromLabels = {
        drag_drop: {
            upload: 'Upload file',
            drop_or_upload: 'Drag and drop or click to upload'
        },
        title: 'Title',
        description: 'Description',
        date: 'Creation Date',
        duration: 'Duration',
        person: 'Person', // author??
        location: 'Location',
        transcript: 'Transcript',
        reset: 'Reset',
        save: 'Save'
    };
    file: File;

    constructor(
        private readonly _n: NotificationService,
        private readonly _fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.form = this._fb.group({
            file: [undefined, Validators.required],
            titles: this._fb.array([
                this._fb.control('')
            ]),
            description: ['', Validators.required],
            date: ['', Validators.required],
            duration: ['', Validators.required],
            persons: this._fb.array([
                this._fb.control('')
            ]),
            location: ['', Validators.required],
            transcript: ['', Validators.required]
        });
    }

    uploadFile(event): void {
        let files: File[] = [];
        files = event.target?.files ? event.target.files : event;
        if (this.isMoreThanOneFile(files)) {
            const error = 'ERROR: Only one file allowed at a time';
            console.log(error);
            this._n.openSnackBar(error);
            this.file = null;
        } else {
            this.file = files[0];
        }
        this.fileControl.setValue(this.file);
        console.log('LIST', event, this.file, this.fileControl);
    }

    onSubmit(): void {
        console.log(this.form);
    }

    addTitle(): void {
        this.titlesArray.push(this._fb.control(''));
    }

    addPerson(): void {
        this.personsArray.push(this._fb.control(''));
    }

    isMoreThanOneFile(files: File[]): boolean {
        return files.length > 1;
    }

    deleteAttachment(i?: number): void {
        // this.files.splice(i, 1);
        this.file = undefined;
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
