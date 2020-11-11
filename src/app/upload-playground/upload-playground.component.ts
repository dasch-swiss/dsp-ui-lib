import { Component } from '@angular/core';
import { Constants } from '@dasch-swiss/dsp-js';

@Component({
    selector: 'app-upload-playground',
    templateUrl: './upload-playground.component.html',
    styleUrls: ['./upload-playground.component.scss']
})
export class UploadPlaygroundComponent {

    type = Constants.StillImageFileValue;
}
