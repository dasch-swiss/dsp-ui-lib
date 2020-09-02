import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiResponseError, StringLiteral } from '@dasch-swiss/dsp-js';
import { ConfirmationDialogComponent, ConfirmationDialogData, DspMessageData, SortingService } from '@dasch-swiss/dsp-ui';

@Component({
  selector: 'app-action-playground',
  templateUrl: './action-playground.component.html',
  styleUrls: ['./action-playground.component.scss']
})
export class ActionPlaygroundComponent implements OnInit {

    // loading: boolean;
    // session: Session;

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

    constructor(
        // private _sessionService: SessionService,
        // @Inject(DspApiConnectionToken) private dspApiConnection: KnoraApiConnection,
        private _sortingService: SortingService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.refresh();

        // already logged-in user?
        // this.session = this._sessionService.getSession();
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
        const dialogData = new ConfirmationDialogData();
        dialogData.title = 'Are you sure want to do this?';
        dialogData.message = 'Confirming this action will delete the value. (Not really though, this is just a test message)';
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

    // TODO: Will be replaced by login process from action module
    /*
    login() {
        this.loading = true;
        this.dspApiConnection.v2.auth.login('username', 'root', 'test').subscribe(
            (response: ApiResponseData<LoginResponse>) => {
                this._sessionService.setSession(response.body.token, 'root', 'username').subscribe(
                    () => {
                        this.loading = false;
                        this.session = this._sessionService.getSession();
                    });
            },
            (error: ApiResponseError) => {
                // error handling
                // this.loginErrorUser = (error.status === 404);
                // this.loginErrorPw = (error.status === 401);
                // this.loginErrorServer = (error.status === 0);

                // this.errorMessage = error;

                this.loading = false;
                // TODO: update error handling similar to the old method (see commented code below)
            }
        );
    }

    // TODO: Will be replaced by login process from action module
    logout() {
        this.loading = true;
        this.dspApiConnection.v2.auth.logout().subscribe(
            (response: ApiResponseData<LogoutResponse>) => {
                this._sessionService.destroySession();
                this.session = this._sessionService.getSession();
                this.loading = false;
            }
        )
    }
    */

}
