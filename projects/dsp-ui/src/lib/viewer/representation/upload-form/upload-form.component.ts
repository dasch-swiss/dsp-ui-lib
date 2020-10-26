import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../action';

@Component({
    selector: 'dsp-upload-form',
    templateUrl: './upload-form.component.html',
    styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {

    // files: File[] = [];
    resourceTyoe = 'Interview';
    form: FormGroup;
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
            title: ['', Validators.required],
            description: ['', Validators.required],
            date: ['', Validators.required],
            duration: ['', Validators.required],
            person: ['', Validators.required],
            location: ['', Validators.required],
            transcript: ['', Validators.required]
        });
    }

    uploadFile(event): void {
        let files: File[] = [];
        // this.file = event.target?.files ? event.target.files[0] : event[0];
        files = event.target?.files ? event.target.files : event;
        if (this.isMoreThanOneFile(files)) {
            const error = 'ERROR: Only one file allowed at a time';
            console.log(error);
            this._n.openSnackBar(error);
            this.file = null;
        } else {
            this.file = files[0];
        }
        // const filesList = event.target?.files ? event.target.files : event as FileList;
        console.log('LIST', event, this.file);

        // check if file or folder dropped
        // const items = event.dataTransfer.items;
        // for (const item of items) {
        //     if (item.kind === 'file') {
        //         const entry = item.webkitGetAsEntry();
        //         if (entry.isFile) {
        //             console.log('FILE');
        //         } else if (entry.isDirectory) {
        //             console.log('DIRECTORY');
        //         }
        //     }
        // }

        // for (const file of filesList) {
        // this.files.push(file);
        // }
    }

    onSubmit(): void {}

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
