import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiResponseError } from '@dasch-swiss/dsp-js';
import { StatusMsg } from '../../../assets/i18n/statusMsg';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(
        private _snackBar: MatSnackBar,
        private _statusMsg: StatusMsg
    ) { }


    // TODO: maybe we can add more parameters like:
    // action: string = 'x', duration: number = 4200
    // and / or type: 'note' | 'warning' | 'error' | 'success'; which can be used for the panelClass
    openSnackBar(notification: string | ApiResponseError) {

        let message: string;
        let duration = 4200;
        let panelClass: string;

        if (notification instanceof ApiResponseError) {
            const status = (notification.status === 0 ? 503 : notification.status);

            // get list of default http status message
            let defaultStatusMsg = this._statusMsg.default;

            message = defaultStatusMsg[status].message + ' ('+status+'): '+ defaultStatusMsg[status].description;
            // 15s
            duration = 15000;
            panelClass = 'error';
        } else {
            message = message;
            panelClass = 'success';
        }

        this._snackBar.open(message, 'x', {
            duration: duration,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: panelClass
        });

    }

}
