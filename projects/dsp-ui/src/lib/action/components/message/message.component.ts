import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponseError } from '@dasch-swiss/dsp-js';
import { StatusMsg } from '../../../../assets/i18n/statusMsg';

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

export class tmpApiResponseError {
    status: number;
    message: string;
    name: string;
    request: any;
    response: any;
    responseType: string;
    xhr: XMLHttpRequest

}

@Component({
  selector: 'dsp-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

    /**
     * Message type: DspMessageData
     *
     * @param message This type needs at least a status number (0-599).
     * In this case, or if type is ApiServiceError, it takes the default status messages
     * from the list of HTTP status codes (https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)
     */
    @Input() message: DspMessageData = new DspMessageData();

    /**
     * Message type: ApiServiceError
     * @param apiError
     */
    @Input() apiError?: ApiResponseError;

    /**
     * Size of the message: large, medium or short?
     * @param size Default size is 'large'
     */
    @Input() size: 'short' | 'medium' | 'large' = 'large';

    /**
     * @deprecated
     * @param short Show short message only
     * A small message box to notify the user an event has occured.
     */
    @Input() short = (this.size === 'short');

    /**
     * @deprecated
     * @param medium Show medium message
     * A message box without footnote or links.
     */
    @Input() medium = (this.size === 'medium');

    /**
     * @param duration How long should the message be displayed
     */
    @Input() duration?: number;

    statusMsg: any;

    isLoading = true;

    showLinks = false;

    // disable message
    disable = false;

    /**
     * @ignore
     * default link list, which will be used in message content to give a user some possibilities
     * what he can do in the case of an error
     *
     */
    links: any = {
        title: 'You have the following possibilities now',
        list: [
            {
                label: 'go to the start page',
                route: '/',
                icon: 'keyboard_arrow_right'
            },
            {
                label: 'try to login',
                route: '/login',
                icon: 'keyboard_arrow_right'
            },
            {
                label: 'go back',
                route: '<--',
                icon: 'keyboard_arrow_left'
            }
        ]
    };

    footnote: any = {
        text: 'If you think this is a mistake, please',
        team: {
            dasch:
                '<a href=\'https://docs.dasch.swiss/community/\' target=\'_blank\'> contact the DaSCH support.</a>'
        }
    };

    constructor(
        private _router: Router,
        private _location: Location,
        private _activatedRoute: ActivatedRoute,
        private _status: StatusMsg
    ) { }

    ngOnInit() {
        if (this.apiError) {
            this.message.status = this.apiError.status;
        }

        this.statusMsg = this._status.default;

        if (!this.message) {
            this._activatedRoute.data.subscribe((data: any) => {
                this.message.status = data.status;
            });
        }

        this.message = this.setMessage(this.message);
        this.isLoading = false;
        if (this.duration) {
            setTimeout(() => this.disable = true, this.duration);
        }
    }

    setMessage(msg: DspMessageData) {
        const tmpMsg: DspMessageData = {} as DspMessageData;

        const s: number = msg.status === 0 ? 503 : msg.status;

        tmpMsg.status = s;
        tmpMsg.route = msg.route;
        tmpMsg.statusMsg = msg.statusMsg;
        tmpMsg.statusText = msg.statusText;
        tmpMsg.route = msg.route;
        tmpMsg.footnote = msg.footnote;

        switch (true) {
            case s > 0 && s < 300:
                // the message is a note
                tmpMsg.type = 'note';
                tmpMsg.statusMsg =
                    msg.statusMsg !== undefined
                        ? msg.statusMsg
                        : this.statusMsg[s].message;
                tmpMsg.statusText =
                    msg.statusText !== undefined
                        ? msg.statusText
                        : this.statusMsg[s].description;
                // console.log('the message is a note');
                break;
            case s >= 300 && s < 400:
                // the message is a warning
                tmpMsg.type = 'warning';
                tmpMsg.statusMsg =
                    msg.statusMsg !== undefined
                        ? msg.statusMsg
                        : this.statusMsg[s].message;
                tmpMsg.statusText =
                    msg.statusText !== undefined
                        ? msg.statusText
                        : this.statusMsg[s].description;
                // console.log('the message is a warning');

                break;
            case s >= 400 && s < 500:
                // the message is a client side (app) error
                // console.error('the message is a client side (app) error', s);
                tmpMsg.type = 'error';
                tmpMsg.statusMsg =
                    msg.statusMsg !== undefined
                        ? msg.statusMsg
                        : this.statusMsg[s].message;
                tmpMsg.statusText =
                    msg.statusText !== undefined
                        ? msg.statusText
                        : this.statusMsg[s].description;
                tmpMsg.footnote =
                    msg.footnote !== undefined
                        ? msg.footnote
                        : this.footnote.text + ' ' + this.footnote.team.dasch;
                this.showLinks = (this.size === 'large');
                break;
            case s >= 500 && s < 600:
                // the message is a server side (api) error
                // console.error('the message is a server side (api) error');
                tmpMsg.type = 'error';
                tmpMsg.statusMsg =
                    msg.statusMsg !== undefined
                        ? msg.statusMsg
                        : this.statusMsg[s].message;
                tmpMsg.statusText =
                    msg.statusText !== undefined
                        ? msg.statusText
                        : this.statusMsg[s].description;
                tmpMsg.footnote =
                    this.footnote.text + ' ' + this.footnote.team.dasch;
                this.showLinks = false;
                break;
            default:
                // no default configuration?
                break;
        }

        return tmpMsg;
    }

    goToLocation(route: string) {
        if (route === '<--') {
            this._location.back();
        } else {
            this._router.navigate([route]);
        }
    }

    closeMessage() {
        this.disable = !this.disable;
    }

}
