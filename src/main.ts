import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

function bootstrapFailed(result) {
  console.error('bootstrap-fail! Config is missing or api parameters are not defined', result);
}

fetch(`config/config.${environment.name}.json`)
  .then(response => response.json())
  .then(config => {
    if (!config) {
      bootstrapFailed(config);
      return;
    }

    // store the response somewhere that the AppInitService can read it.
    window['tempConfigStorage'] = config;

    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch(err => bootstrapFailed(err));
  })
  .catch(bootstrapFailed);
