import { InjectionToken, NgModule } from '@angular/core';
// import { DspConfig } from './core.config';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';

// config for knora-api-js-lib (@knora/api) config object
export const KnoraApiConfigToken = new InjectionToken<KnoraApiConfig>('Knora api configuration');

// connection config for knora-api-js-lib (@knora/api) connection
export const KnoraApiConnectionToken = new InjectionToken<KnoraApiConnection>('Knora api connection instance');

// config for dsp-ui
// export const KuiConfigToken = new InjectionToken<DspConfig>('Main configuration for dsp-ui modules');

@NgModule({
    declarations: [],
    imports: [],
    exports: []
})
export class DspCoreModule {
}
