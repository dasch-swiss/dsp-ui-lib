import { Injectable } from '@angular/core';
import { KnoraApiConfig, KnoraApiConnection } from '@dasch-swiss/dsp-js';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  dspApiConfig: KnoraApiConfig;

  constructor() {}

  Init() {

    return new Promise<void>((resolve) => {

      // get api config information from temp storage
      const dspApiConfig: KnoraApiConfig = window['tempConfigStorage'] as KnoraApiConfig;

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
}
