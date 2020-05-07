import { Injectable } from '@angular/core';

import { KnoraApiConnection, KnoraApiConfig } from '@knora/api';
import { KuiConfig } from '@dasch-swiss/dsp-ui';



@Injectable()
export class AppInitService {

  static knoraApiConnection: KnoraApiConnection;

  static knoraApiConfig: KnoraApiConfig;

  static kuiConfig: KuiConfig;

  constructor() { }

  Init() {

    return new Promise<void>((resolve, reject) => {

      // init dsp-ui configuration
      AppInitService.kuiConfig = window['tempConfigStorage'] as KuiConfig;

      // init knora-api configuration
      AppInitService.knoraApiConfig = new KnoraApiConfig(
        AppInitService.kuiConfig.knora.apiProtocol,
        AppInitService.kuiConfig.knora.apiHost,
        AppInitService.kuiConfig.knora.apiPort
      );

      // set knora-api connection configuration
      AppInitService.knoraApiConnection = new KnoraApiConnection(AppInitService.knoraApiConfig);

      resolve();
    });
  }
}
