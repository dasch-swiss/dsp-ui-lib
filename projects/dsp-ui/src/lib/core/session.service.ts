import { Inject, Injectable } from '@angular/core';
import {
    ApiResponseData,
    ApiResponseError,
    Constants,
    CredentialsResponse,
    KnoraApiConfig,
    KnoraApiConnection,
    UserResponse
} from '@dasch-swiss/dsp-js';
import { DspApiConfigToken, DspApiConnectionToken } from './core.module';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Currently logged-in user information
 */
interface CurrentUser {
    // username
    name: string;

    // json web token
    jwt: string;

    // default language for ui
    lang: string;

    // is system admin?
    sysAdmin: boolean;

    // list of project shortcodes where the user is project admin
    projectAdmin: string[];
}

/**
 * Session with id (= login timestamp) and inforamtion about logged-in user
 */
export interface Session {
    id: number;
    user: CurrentUser;
}

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    /**
     * max session time in milliseconds
     * default value (24h): 86400000
     *
     */
    readonly MAX_SESSION_TIME: number = 86400000; // 1d = 24 * 60 * 60 * 1000


    constructor(
        @Inject(DspApiConnectionToken) private dspApiConnection: KnoraApiConnection
    ) { }

    /**
     * get session information from localstorage
     */
    getSession(): Session {
        if (localStorage.getItem('session') !== null) {
            return JSON.parse(localStorage.getItem('session'));
        }

        return undefined;
    }

    /**
     * set session by using the json web token (jwt) and the user object;
     * it will be used in the login process
     *
     * @param jwt
     * @param username
     */
    setSession(jwt: string, identifier: string, identifierType: 'email' | 'username'): Observable<void> {

        this.dspApiConnection.v2.jsonWebToken = (jwt ? jwt : '');

        // get user information
        return this.dspApiConnection.admin.usersEndpoint.getUser(identifierType, identifier).pipe(
            map((response: ApiResponseData<UserResponse> | ApiResponseError) => {
                this._storeSessionInLocalStorage(response, jwt);
                // return type is void
                return;
            })
        );
    }

    /**
     * Validate intern session and check knora api credentials if necessary.
     * If a json web token exists, it doesn't mean that the knora api credentials are still valid.
     *
     * @returns boolean
     */
    isSessionValid(): Observable<boolean> {
        // mix of checks with session.validation and this.authenticate
        const session = JSON.parse(localStorage.getItem('session'));

        const tsNow: number = this._setTimestamp();

        if (session) {

            this.dspApiConnection.v2.jsonWebToken = session.user.jwt;

            // check if the session is still valid:
            if (session.id + this.MAX_SESSION_TIME <= tsNow) {
                // the internal (dsp-ui) session has expired
                // check if the api credentials are still valid

                return this.dspApiConnection.v2.auth.checkCredentials().pipe(
                    map((credentials: ApiResponseData<CredentialsResponse> | ApiResponseError) => {
                            const idUpdated = this._updateSessionId(credentials, session, tsNow);
                            return idUpdated;
                        }
                    )
                );

            } else {
                // the internal (dsp-ui) session is still valid
                return of(true);
            }
        } else {
            // no session found; update knora api connection with empty jwt
            this.dspApiConnection.v2.jsonWebToken = '';
            return of(false);
        }
    }

    /**
     * Destroy session by removing the session from local storage
     *
     */
    destroySession() {
        localStorage.removeItem('session');
    }

    /**
     * Update the dsp-api-config and dsp-api-connection of @dasch-swiss/dsp-js
     *
     * @param  {string} jwt?
     */
    // private _updateDspApiConnection(jwt?: string) {
    //     this.dspApiConfig.jsonWebToken = (jwt ? jwt : '');
    //     this.dspApiConnection.v2.jsonWebToken = this.dspApiConfig.jsonWebToken;
    // }

    /**
     * Returns a timestamp represented in seconds
     * @returns number
     */
    private _setTimestamp(): number {
        return Math.floor(Date.now() / 1000);
    }

    /**
     * Store session in local storage
     * @param response response from getUser method call
     * @param jwt JSON web token string
     */
    private _storeSessionInLocalStorage(response: any, jwt: string) {
        let session: Session;

        if (response instanceof ApiResponseData) {
            let sysAdmin = false;
            const projectAdmin: string[] = [];

            // get permission information: a) is user sysadmin? b) get list of project iri's where user is project admin
            const groupsPerProjectKeys: string[] = Object.keys(response.body.user.permissions.groupsPerProject);

            for (const key of groupsPerProjectKeys) {
                if (key === Constants.SystemProjectIRI) {
                    sysAdmin = response.body.user.permissions.groupsPerProject[key].indexOf(Constants.SystemAdminGroupIRI) > -1;
                }

                if (response.body.user.permissions.groupsPerProject[key].indexOf(Constants.ProjectAdminGroupIRI) > -1) {
                    projectAdmin.push(key);
                }
            }

            // store session information in browser's localstorage
            // TODO: jwt will be removed, when we have a better cookie solution (DSP-261)
            session = {
                id: this._setTimestamp(),
                user: {
                    name: response.body.user.username,
                    jwt: jwt,
                    lang: response.body.user.lang,
                    sysAdmin: sysAdmin,
                    projectAdmin: projectAdmin
                }
            };

            // update localStorage
            localStorage.setItem('session', JSON.stringify(session));
        } else {
            localStorage.removeItem('session');
            console.error(response);
        }
    }

    /**
     * Updates the id of the current session in the local storage
     * @param credentials response from getCredentials method call
     * @param session the current session
     * @param timestamp timestamp in form of a number
     */
    private _updateSessionId(credentials: any, session: Session, timestamp: number): boolean {
        if (credentials instanceof ApiResponseData) {
            // the knora api credentials are still valid
            // update the session.id
            session.id = timestamp;
            localStorage.setItem('session', JSON.stringify(session));
            return true;
        } else {
            // a user is not authenticated anymore!
            this.destroySession();
            return false;
        }
    }
}
