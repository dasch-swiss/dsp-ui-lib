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
        @Inject(MAT_DIALOG_DATA) private data: ConfirmationDialogData,
        private dialogRef: MatDialogRef<ConfirmationDialogComponent>
    ) {
        if (data) {
            this.title = data.title;
            this.message = data.message;
            this.confirmButtonText = data.buttonTextOk;
            this.cancelButtonText = data.buttonTextCancel;
        }
    }

    onConfirmClick(): void {
        this.dialogRef.close(true);
    }

}
