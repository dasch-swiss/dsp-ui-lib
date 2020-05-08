import {InjectionToken, NgModule} from '@angular/core';
import {KuiConfig} from './core.config';
import {KnoraApiConfig, KnoraApiConnection} from '@knora/api';

// config for knora-api-js-lib (@knora/api) config object
export const KnoraApiConfigToken = new InjectionToken<KnoraApiConfig>('Knora api configuration');

// connection config for knora-api-js-lib (@knora/api) connection
export const KnoraApiConnectionToken = new InjectionToken<KnoraApiConnection>('Knora api connection instance');

// config for knora-ui
export const KuiConfigToken = new InjectionToken<KuiConfig>('Main configuration for knora-ui modules');

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class KuiCoreModule {
}
