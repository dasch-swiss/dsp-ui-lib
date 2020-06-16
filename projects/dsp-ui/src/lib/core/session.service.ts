import { Inject, Injectable } from '@angular/core';
import {
        ApiResponseData,
        ApiResponseError,
        CredentialsResponse,
        KnoraApiConfig,
        KnoraApiConnection,
        UserResponse,
        Constants
    } from '@dasch-swiss/dsp-js';

import { DspApiConfigToken, DspApiConnectionToken } from './core.module';

/**
 * Currently logged-in user information
 */
export interface CurrentUser {
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
        @Inject(DspApiConnectionToken) private dspApiConnection: KnoraApiConnection,
        @Inject(DspApiConfigToken) private dspApiConfig: KnoraApiConfig
    ) { }

    /**
     * get the session via the localstorage
     */
    getSession(): Session {
        if (localStorage.getItem('session') !== null) {
            return JSON.parse(localStorage.getItem('session'));
        }

        return undefined;
    }

    /**
     * set the session by using the json web token (jwt) and the user object;
     * it will be used in the login process
     *
     * @param jwt
     * @param username
     */
    setSession(jwt: string, identifier: string, identifierType: 'email' | 'username') {

        let session: Session;

        this.updateKnoraApiConnection(jwt);

        // get user information
        this.dspApiConnection.admin.usersEndpoint.getUser(identifierType, identifier).subscribe(
            (response: ApiResponseData<UserResponse>) => {
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
                session = {
                    id: this.setTimestamp(),
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
            },
            (error: ApiResponseError) => {
                localStorage.removeItem('session');
                console.error(error);
            }
        );
    }

    /**
     * Validate intern session and check knora api credentials if necessary.
     * If a json web token exists, it doesn't mean that the knora api credentials are still valid.
     *
     * @returns boolean
     */
    validateSession(): boolean {
        // mix of checks with session.validation and this.authenticate
        const session = JSON.parse(localStorage.getItem('session'));

        const tsNow: number = this.setTimestamp();

        if (session) {

            this.updateKnoraApiConnection(session.user.jwt);

            // check if the session is still valid:
            if (session.id + this.MAX_SESSION_TIME <= tsNow) {
                // the internal (knora-ui) session has expired
                // check if the api credentails are still valid

                // console.error('session is not valid; check knora api credentials');

                this.dspApiConnection.v2.auth.checkCredentials().subscribe(
                    (response: ApiResponseData<CredentialsResponse>) => {
                        // the knora api credentials are still valid
                        // console.log('knora api credentials', response);

                        // refresh the jwt in @dasch-swiss/dsp-js
                        this.updateKnoraApiConnection(session.user.jwt);

                        // update the session.id
                        session.id = tsNow;

                        localStorage.setItem('session', JSON.stringify(session));

                        // console.log('knora api credentials are valid; return', true);
                        return true;
                    },
                    (error: ApiResponseError) => {
                        // a user is not authenticated anymore!
                        // console.error('session.service -- validateSession -- authenticate: the session expired on API side');

                        this.destroySession();

                        // console.warn('knora api credentials are not valid; return', false);
                        return false;
                    }
                );

            } else {
                // the internal (knora-ui) session is still valid

                // console.log('session is valid; return', true);
                return true;
            }
        } else {
            // no session found; update knora api connection with empty jwt
            this.updateKnoraApiConnection();

            // console.warn('session is not valid; return', false);
            return false;
        }
    }

    /**
     * update the session storage
     * @param jwt
     * @param username
     *
     * @returns boolean
     */
    updateSession(jwt: string, username: string): boolean {
        if (jwt && username) {
            this.setSession(jwt, username, 'username');
            return true;
        } else {
            return false;
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
     * Update the knora-api-config and knora-api-connection of @dasch-swiss/dsp-js
     *
     * @param  {string} jwt?
     */
    private updateKnoraApiConnection(jwt?: string) {
        this.dspApiConfig.jsonWebToken = (jwt ? jwt : '');
        this.dspApiConnection = new KnoraApiConnection(this.dspApiConfig);
    }

    /**
     * Returns a timestamp represented in seconds
     * @returns number
     */
    private setTimestamp(): number {
        return Math.floor(Date.now() / 1000);
    }


}
