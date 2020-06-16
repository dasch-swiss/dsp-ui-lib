import { InjectionToken, NgModule } from '@angular/core';
// import { DspConfig } from './core.config';
import { KnoraApiConfig, KnoraApiConnection } from '@dasch-swiss/dsp-js';

// config for dsp-js-lib (@dasch-swiss/dsp-js) config object
export const DspApiConfigToken = new InjectionToken<KnoraApiConfig>('DSP api configuration');

// connection config for dsp-js-lib (@dasch-swiss/dsp-js) connection
export const DspApiConnectionToken = new InjectionToken<KnoraApiConnection>('DSP api connection instance');

@NgModule({
    declarations: [],
    imports: [],
    exports: []
})
export class DspCoreModule {

}
