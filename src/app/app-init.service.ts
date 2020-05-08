import { Injectable } from '@angular/core';
import { KuiConfig } from '@dasch-swiss/dsp-ui';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';

@Injectable()
export class AppInitService {

    static knoraApiConnection: KnoraApiConnection;

    static knoraApiConfig: KnoraApiConfig;

    constructor() { }

    Init() {

        return new Promise<void>((resolve, reject) => {

            // init dsp-ui configuration
            const dspConfig: KuiConfig = window['tempConfigStorage'] as KuiConfig;

            console.log(window);

            // init knora-api configuration
            AppInitService.knoraApiConfig = new KnoraApiConfig(
                dspConfig.knora.apiProtocol,
                dspConfig.knora.apiHost,
                dspConfig.knora.apiPort
            );

            // set knora-api connection configuration
            AppInitService.knoraApiConnection = new KnoraApiConnection(AppInitService.knoraApiConfig);

            resolve();
        });
    }
}
