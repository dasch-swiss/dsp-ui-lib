import { Component } from '@angular/core';

@Component({
    selector: 'dsp-upload-form',
    templateUrl: './upload-form.component.html',
    styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent {

    // files: File[] = [];
    file: File;
    error: string;

    uploadFile(event: any): void {
        this.file = event.target?.files ? event.target.files[0] : event[0];
        // const filesList = event.target?.files ? event.target.files : event as FileList;
        console.log('LIST', this.file);

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
