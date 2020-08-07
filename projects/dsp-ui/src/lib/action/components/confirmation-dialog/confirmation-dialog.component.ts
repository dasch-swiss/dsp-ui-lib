import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export class ConfirmationDialogData {
    title: string;
    message: string;
    buttonTextOk: string;
    buttonTextCancel: string;
}

@Component({
  selector: 'dsp-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {

    title: string;
    message: string;
    confirmButtonText: string;
    cancelButtonText: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) private _data: ConfirmationDialogData,
        private _dialogRef: MatDialogRef<ConfirmationDialogComponent>
    ) {
        if (_data) {
            this.title = _data.title;
            this.message = _data.message;
            this.confirmButtonText = _data.buttonTextOk;
            this.cancelButtonText = _data.buttonTextCancel;
        }
    }

    onConfirmClick(): void {
        this._dialogRef.close(true);
    }

}
