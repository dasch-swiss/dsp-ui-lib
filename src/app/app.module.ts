import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KnoraApiConnection } from '@dasch-swiss/dsp-js';
import {
    AppInitService,
    DspActionModule,
    DspApiConfigToken,
    DspApiConnectionToken,
    DspCoreModule,
    DspSearchModule,
    DspViewerModule
} from '@dasch-swiss/dsp-ui';
import { MatJDNConvertibleCalendarDateAdapterModule } from 'jdnconvertiblecalendardateadapter';
import { environment } from '../environments/environment';
import { ActionPlaygroundComponent } from './action-playground/action-playground.component';
import { AdvancedSearchPlaygroundComponent } from './advanced-search-playground/advanced-search-playground.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModifyComponent } from './modify/modify.component';
import { ReadComponent } from './read/read.component';
import { SearchPlaygroundComponent } from './search-playground/search-playground.component';
import { SearchResultsComponent } from './search-playground/search-results/search-results.component';
import { StillImagePlaygroundComponent } from './still-image/still-image-playground.component';
import { ViewerPlaygroundComponent } from './viewer-playground/viewer-playground.component';

@NgModule({
    declarations: [
        AppComponent,
        ModifyComponent,
        ReadComponent,
        ActionPlaygroundComponent,
        SearchPlaygroundComponent,
        SearchResultsComponent,
        AdvancedSearchPlaygroundComponent,
        StillImagePlaygroundComponent,
        ViewerPlaygroundComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        DspActionModule,
        DspCoreModule,
        DspSearchModule,
        DspViewerModule,
        MatJDNConvertibleCalendarDateAdapterModule,
        MatButtonModule,
        MatListModule,
        MatSliderModule
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: (appInitService: AppInitService) =>
                (): Promise<void> => {
                    return appInitService.Init('config', environment);
                },
            deps: [AppInitService],
            multi: true
        },
        {
            provide: DspApiConfigToken,
            useFactory: (appInitService: AppInitService) => appInitService.dspApiConfig,
            deps: [AppInitService]
        },
        {
            provide: DspApiConnectionToken,
            useFactory: (appInitService: AppInitService) => new KnoraApiConnection(appInitService.dspApiConfig),
            deps: [AppInitService]
        }
    ],
    bootstrap: [AppComponent]

})
export class AppModule {
}
