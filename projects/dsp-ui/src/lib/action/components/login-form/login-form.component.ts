import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginResponse, LogoutResponse } from '@dasch-swiss/dsp-js';
import { Session, SessionService } from '../../../core/session.service';

@Component({
    selector: 'dsp-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

    /**
     * Navigate to the defined url (or path) after successful login
     *
     * @param navigate
     */
    @Input() navigate?: string;

    /**
     * Set your theme color here,
     * it will be used in the progress-indicator and the buttons
     *
     * @param color
     */
    @Input() color?: string;

    /**
     * Set whether or not you want icons to display in the input fields
     *
     * @param icons
     */
    @Input() icons?: boolean;

    /**
     * Emits true when the login process was successful and false in case of error
     *
     * @param loginSuccess
     *
     */
    @Output() loginSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * Emits true when the logout process was successful and false in case of error
     *
     * @param logoutSuccess
     *
     */
    @Output() logoutSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();

    // is there already a valid session?
    session: Session;

    // form
    form: FormGroup;

    // show progress indicator
    loading = false;

    isError: boolean;

    // specific error messages
    loginFailed = false;
    loginErrorServer = false;

    // labels for the login form
    // TODO: should be handled by translation service (i18n)
    formLabel = {
        title: 'Login here',
        name: 'Username',
        pw: 'Password',
        submit: 'Login',
        retry: 'Retry',
        logout: 'LOGOUT',
        remember: 'Remember me',
        forgot_pw: 'Forgot password?',
        error: {
            failed: 'Password or username is wrong',
            server: 'An error has occurred when connecting to the server. Try again later or contact the DaSCH support.'
        }
    };

    // error definitions for the following form fields
    formErrors = {
        username: '',
        password: ''
    };

    // error messages for the form fields defined in formErrors
    validationMessages = {
        username: {
            required: 'user name is required.'
        },
        password: {
            required: 'password is required'
        }
    };


    constructor(
        private _session: SessionService,
        private _fb: FormBuilder
    ) { }

    ngOnInit() {
        // if session is valid (a user is logged-in) show a message, otherwise build the form
        this._session.isSessionValid().subscribe(
            result => {
                // returns a result if session is still valid
                if (result) {
                    this.session = JSON.parse(localStorage.getItem('session'));
                } else {
                    // session is invalid, build the login form
                    this.buildLoginForm();
                }
            }
        );
    }

    buildLoginForm(): void {
        this.form = this._fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    /**
     * @ignore
     *
     * Login and set session
     */
    login() {

        this.loading = true;
        this.isError = false;


        // grab values from form
        const identifier = this.form.get('username').value;
        const password = this.form.get('password').value;

        // set identifier type
        const identifierType: 'iri' | 'email' | 'username' = (identifier.indexOf('@') > -1 ? 'email' : 'username');

        this._session.login(identifierType, identifier, password).subscribe(
            (response: LoginResponse) => {

                this._session.setSession(response.token, identifier, identifierType).subscribe(
                    () => {
                        this.session = this._session.getSession();
                        this.loginSuccess.emit(true);
                        this.loading = false;
                    }
                );
            },
            (error: HttpErrorResponse) => {
                // error handling

                this.loginSuccess.emit(false);
                this.isError = true;

                this.loading = false;
            }
        );

    }

    /**
     * @ignore
     *
     * Logout and destroy session
     *
     */
    logout() {
        this.loading = true;

        this._session.logout().subscribe(
            (response: LogoutResponse) => {
                this.logoutSuccess.emit(true);
                this.loading = false;
                this.buildLoginForm();
                this.session = undefined;
                this.form.get('password').setValue('');
            },
            (error: HttpErrorResponse) => {
                this.logoutSuccess.emit(false);
                this.loading = false;
            }
        );

    }

}
