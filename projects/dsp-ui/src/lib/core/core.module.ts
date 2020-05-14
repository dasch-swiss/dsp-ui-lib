import { InjectionToken, NgModule } from '@angular/core';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';

// config for knora-api-js-lib (@knora/api) config object
export const DspApiConfigToken = new InjectionToken<KnoraApiConfig>('DSP api configuration');

// connection config for knora-api-js-lib (@knora/api) connection
export const DspApiConnectionToken = new InjectionToken<KnoraApiConnection>('DSP api connection instance');

@NgModule({
    declarations: [],
    imports: [],
    exports: []
})
export class DspCoreModule {

}
