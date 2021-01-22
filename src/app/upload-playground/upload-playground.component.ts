import { Component, OnInit, ViewChild } from '@angular/core';
import { Constants } from '@dasch-swiss/dsp-js';
import { UploadFileComponent } from '@dasch-swiss/dsp-ui';

@Component({
    selector: 'app-upload-playground',
    templateUrl: './upload-playground.component.html',
    styleUrls: ['./upload-playground.component.scss']
})
export class UploadPlaygroundComponent implements OnInit {
    @ViewChild('upload') uploadComp: UploadFileComponent;

    type = Constants.StillImageFileValue;

    ngOnInit() {
        console.log(this);
    }

    uploadFile(fileUpload: any) {
        console.log(fileUpload);
    }

    cancelUpload() {
        console.log('upload cancelled');
    }
}
