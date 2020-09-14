import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReadValue } from '@dasch-swiss/dsp-js';

export class ConfirmationDialogData {
    value: ReadValue;
    buttonTextOk: string;
    buttonTextCancel: string;
}

@Component({
  selector: 'dsp-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {

    // type assertion doesn't seem to be enforced
    // https://stackoverflow.com/a/57787554
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
        private _dialogRef: MatDialogRef<ConfirmationDialogComponent>
    ) { }

    onConfirmClick(): void {
        this._dialogRef.close(true);
    }

}
