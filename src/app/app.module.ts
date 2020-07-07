import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatJDNConvertibleCalendarDateAdapterModule } from 'jdnconvertiblecalendardateadapter';
import { ActionPlaygroundComponent } from './action-playground/action-playground.component';
import { AppInitService } from './app-init.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModifyComponent } from './modify/modify.component';
import { ReadComponent } from './read/read.component';
import {
    DspActionModule,
    DspApiConfigToken,
    DspApiConnectionToken,
    DspCoreModule,
    DspSearchModule,
    DspViewerModule
} from '@dasch-swiss/dsp-ui';
import { SearchPlaygroundComponent } from './search-playground/search-playground.component';
import { SearchResultsComponent } from './search-playground/search-results/search-results.component';
import { AdvancedSearchPlaygroundComponent } from './advanced-search-playground/advanced-search-playground.component';


export function initializeApp(appInitService: AppInitService) {
    return (): Promise<any> => {
        return appInitService.Init();
    };
}

@NgModule({
    declarations: [
        AppComponent,
        ModifyComponent,
        ReadComponent,
        ActionPlaygroundComponent,
        SearchPlaygroundComponent,
        SearchResultsComponent,
        AdvancedSearchPlaygroundComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        DspCoreModule,
        DspViewerModule,
        DspActionModule,
        DspSearchModule,
        MatJDNConvertibleCalendarDateAdapterModule,
        MatButtonModule,
        MatListModule
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
            provide: DspApiConfigToken,
            useFactory: () => AppInitService.dspApiConfig
        },
        {
            provide: DspApiConnectionToken,
            useFactory: () => AppInitService.dspApiConnection
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
