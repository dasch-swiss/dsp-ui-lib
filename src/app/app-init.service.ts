import { Injectable } from '@angular/core';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  static dspApiConnection: KnoraApiConnection;

  static dspApiConfig: KnoraApiConfig;

  constructor() { }

  Init() {

    return new Promise<void>((resolve) => {

      // get api config information from temp storage
      const dspApiConfig: KnoraApiConfig = window['tempConfigStorage'] as KnoraApiConfig;

      // init dsp-api configuration
      AppInitService.dspApiConfig = new KnoraApiConfig(
        dspApiConfig.apiProtocol,
        dspApiConfig.apiHost,
        dspApiConfig.apiPort,
        dspApiConfig.apiPath,
        dspApiConfig.jsonWebToken,
        dspApiConfig.logErrors
      );

      // set knora-api connection configuration
      AppInitService.dspApiConnection = new KnoraApiConnection(AppInitService.dspApiConfig);

      resolve();
    });
  }
}
