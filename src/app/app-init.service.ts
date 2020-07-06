import { Injectable } from '@angular/core';
import { KnoraApiConfig } from '@dasch-swiss/dsp-js';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppInitService {

    dspApiConfig: KnoraApiConfig;

    constructor() {
    }

    Init() {

        return fetch(`config/config.${environment.name}.json`).then(
            (response: Response) => {
                return response.json();
            }).then(dspApiConfig => {
                console.log(dspApiConfig);

                return new Promise<void>((resolve) => {

                    // init dsp-api configuration
                    this.dspApiConfig = new KnoraApiConfig(
                        dspApiConfig.apiProtocol,
                        dspApiConfig.apiHost,
                        dspApiConfig.apiPort,
                        dspApiConfig.apiPath,
                        dspApiConfig.jsonWebToken,
                        dspApiConfig.logErrors
                    );

                    resolve();

                });
            }
        );
    }
}
