import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {KnoraApiConfigToken, KnoraApiConnectionToken, KuiConfigToken, ViewerModule} from 'knora-ui';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppInitService} from './app-init.service';
import {MatJDNConvertibleCalendarDateAdapterModule} from 'jdnconvertiblecalendardateadapter';
import { ModifyComponent } from './modify/modify.component';
import { ReadComponent } from './read/read.component';

export function initializeApp(appInitService: AppInitService) {
  return (): Promise<any> => {
    return appInitService.Init();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    ModifyComponent,
    ReadComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ViewerModule,
    MatJDNConvertibleCalendarDateAdapterModule,
    MatButtonModule
  ],
  providers: [
    AppInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppInitService],
      multi: true
    },
    {
      provide: KuiConfigToken,
      useFactory: () => AppInitService.kuiConfig
    },
    {
      provide: KnoraApiConfigToken,
      useFactory: () => AppInitService.knoraApiConfig
    },
    {
      provide: KnoraApiConnectionToken,
      useFactory: () => AppInitService.knoraApiConnection
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
