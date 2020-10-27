import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiResponseError, ReadValue, StringLiteral } from '@dasch-swiss/dsp-js';
import { ConfirmationDialogComponent, ConfirmationDialogData, DspMessageData, SortingService } from '@dasch-swiss/dsp-ui';

@Component({
  selector: 'app-action-playground',
  templateUrl: './action-playground.component.html',
  styleUrls: ['./action-playground.component.scss']
})
export class ActionPlaygroundComponent implements OnInit {

    // userIRI filter for select-project component
    userIri = 'http://rdfh.ch/users/9XBCrDV3SRa7kS1WwynB4Q';

    sortProps: any = [
        {
            key: 'firstname',
            label: 'First name'
        },
        {
            key: 'lastname',
            label: 'Last name'
        },
        {
            key: 'creator',
            label: 'Creator'
        }
    ];

    list = [
        {
            firstname: 'Gaston',
            lastname: 'Lagaffe',
            creator: 'André Franquin'
        },
        {
            firstname: 'Mickey',
            lastname: 'Mouse',
            creator: 'Walt Disney'
        },
        {
            firstname: 'Scooby',
            lastname: 'Doo',
            creator: 'Joe Ruby'
        },
        {
            firstname: 'Charlie',
            lastname: 'Brown',
            creator: 'Charles M. Schulz'
        }
    ];

    examples = [
        {
            status: -1,
            label: 'before submit (not ready)'
        },
        {
            status: 0,
            label: 'submitting'
        },
        {
            status: 1,
            label: 'after submit (done)'
        },
        {
            status: 400,
            label: 'in case of an error'
        }
    ];
    status = -1;

    // labels for stringify string literal pipe example
    labels: StringLiteral[] = [
        {
            value: 'Welt',
            language: 'de'
        },
        {
            value: 'World',
            language: 'en'
        },
        {
            value: 'Monde',
            language: 'fr'
        },
        {
            value: 'Mondo',
            language: 'it'
        },
    ];

    // labels for stringify string literal input component example
    stringLiteralInputLabels: StringLiteral[] = [
        {
            value: 'Welt',
            language: 'de'
        },
        {
            value: 'World',
            language: 'en'
        },
        {
            value: 'Monde',
            language: 'fr'
        },
        {
            value: 'Mondo',
            language: 'it'
        },
    ];

    // used to store newly created labels when using the string literal input component with no preloaded values
    stringLiteralInputNewLabels: StringLiteral[];

    // short message example
    shortMessage: DspMessageData = {
        status: 200,
        statusMsg: 'Success',
        statusText: 'You just updated the user profile.',
        type: 'Note',
        footnote: 'Close it'
    };

    // error message example
    errorMessage: ApiResponseError = {
        status: 403,
        url: 'http://0.0.0.0:3333/admin/projects/shortcode/001/members',
        method: 'Http failure response for http://0.0.0.0:3333/admin/projects/shortcode/001/members: 400 Bad Request',
        error: 'error message'
    };

    confirmationDialogResponse: string;
    showTimedMessage: boolean;

    constructor(
        private _sortingService: SortingService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.refresh();
    }

    // only for testing the change of status
    refresh() {
        setTimeout(() => {
            if (this.status === 1) {
                this.status -= 2;
            } else {
                this.status++;
            }
            // Then recall the parent function to
            // create a recursive loop.
            this.refresh();
        }, 2500);
    }

    sortList(key) {
        this.list = this._sortingService.keySortByAlphabetical(this.list, key);
    }

    // when new data is entered in the string literal input component without preloaded values
    handleNewInput(data: StringLiteral[]) {
        this.stringLiteralInputNewLabels = data;
    }

    // when the enter key is pressed in the string literal input component
    submitNewInput() {
        console.log('submit string literal', this.stringLiteralInputNewLabels);
    }

    // confirmation dialog

    openDialog() {
        const testValue = new ReadValue();
        testValue.strval = 'My data 101010101';
        testValue.propertyLabel = 'My label';
        testValue.valueCreationDate = '1993-10-10T19:11:00.00Z';
        testValue.valueHasComment = 'My comment';

        const dialogData = new ConfirmationDialogData();
        dialogData.value = testValue;
        dialogData.buttonTextOk = 'Yes, delete the value';
        dialogData.buttonTextCancel = 'No, keep the value';

        const dialogRef =
            this._dialog.open<ConfirmationDialogComponent, ConfirmationDialogData>(ConfirmationDialogComponent, { data: dialogData});

        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.confirmationDialogResponse = 'Action was confirmed!';
            } else {
                this.confirmationDialogResponse = 'Action was not confirmed';
            }
        });
    }

    openMessage() {
        this.showTimedMessage = true;
        setTimeout(() => { this.showTimedMessage = false; }, 2100);
    }

    getProjectInfo(projectName: string) {
    }

}
