import { Component } from '@angular/core';

@Component({
    selector: 'dsp-upload-form',
    templateUrl: './upload-form.component.html',
    styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent {

    files: File[] = [];

    uploadFile(event: any): void {
        const filesList = event.target?.files ? event.target.files : event as FileList;
        console.log(filesList);

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

        for (const file of filesList) {
        this.files.push(file);
        }
        // this.files = event;
        // console.log('??????', this.files);
    }

    deleteAttachment(i: number): void {
        this.files.splice(i, 1);
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
