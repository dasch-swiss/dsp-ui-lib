import { Component, OnInit, Input, SimpleChange, OnChanges, AfterViewInit } from '@angular/core';

import { StatusMsg } from '../../../assets/i18n/statusMsg';

/**
 * @ignore
 * Data type for messages
 */
export class DspMessageData {
    status: number;
    statusMsg?: string;
    statusText?: string;
    type?: string;
    route?: string;
    footnote?: string;
    errorInfo?: string;
    url?: string;
}

@Component({
  selector: 'dsp-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnChanges {

    /**
     * Message type: DspMessageData or ApiServiceError
     *
     * @param message This type needs at least a status number (0-511).
     * In this case, or if type is ApiServiceError, it takes the default status messages
     * from the list of HTTP status codes (https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)
     */
    @Input() message: DspMessageData = new DspMessageData();

    /**
     * @param short Show short message only
     * It can be used in form to show if a post was successfull or not.
     */
    @Input() short = false;

    // private _short = false;

    // @Input()
    // set short(short: boolean) {
    //     console.log('setter before: ', this._short);
    //     console.log('short: ', short);
    //     this._short = short || false;
    //     console.log('setter after: ', this._short);
    // }

    // get short(): boolean {
    //     console.log('getter called');
    //     return this._short;
    // }

    constructor() { }

    ngOnInit(): void {
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        console.log(changes);
    }

}
