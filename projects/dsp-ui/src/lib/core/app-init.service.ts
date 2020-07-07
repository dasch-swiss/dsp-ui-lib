import { Injectable } from '@angular/core';
import { KnoraApiConfig } from '@dasch-swiss/dsp-js';

@Injectable({
    providedIn: 'root'
})
export class AppInitService {

    dspApiConfig: KnoraApiConfig;

    constructor() {
    }

    /**
     * Fetches and initialises the configuration.
     *
     * @param path path to the config file.
     * @param env environment to be used (dev or prod).
     */
    Init(path: string, env: { name: string; production: boolean }): Promise<void> {

        return new Promise<void>((resolve, reject) => {
            fetch(`${path}/config.${env.name}.json`).then(
                (response: Response) => {
                    return response.json();
                }).then(dspApiConfig => {
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
                }
            ).catch((err) => {
                reject(err);
            });
        });
    }
}
