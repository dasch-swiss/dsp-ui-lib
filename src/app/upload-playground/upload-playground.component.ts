import { Component, ViewChild } from '@angular/core';
import { Constants } from '@dasch-swiss/dsp-js';
import { UploadFileComponent } from '@dasch-swiss/dsp-ui';

@Component({
    selector: 'app-upload-playground',
    templateUrl: './upload-playground.component.html',
    styleUrls: ['./upload-playground.component.scss']
})
export class UploadPlaygroundComponent {
    @ViewChild('upload') uploadComp: UploadFileComponent;

    type = Constants.StillImageFileValue;

    uploadFile(fileUpload: any) {
        console.log(fileUpload);
    }
}
