import { Component, OnInit } from '@angular/core';
import { DspMessageData, SortingService } from '@dasch-swiss/dsp-ui';
import { ApiResponseError } from '@dasch-swiss/dsp-js';

@Component({
  selector: 'app-action-playground',
  templateUrl: './action-playground.component.html',
  styleUrls: ['./action-playground.component.scss']
})
export class ActionPlaygroundComponent implements OnInit {

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

    constructor(private sortingService: SortingService) { }

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
        this.list = this.sortingService.keySortByAlphabetical(this.list, key);
    }
}
