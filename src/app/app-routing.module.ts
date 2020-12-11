import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadFileComponent } from 'projects/dsp-ui/src/lib/viewer';
import { ActionPlaygroundComponent } from './action-playground/action-playground.component';
import { AdvancedSearchPlaygroundComponent } from './advanced-search-playground/advanced-search-playground.component';
import { CkeditorPlaygroundComponent } from './ckeditor/ckeditor-playground/ckeditor-playground.component';
import { ModifyComponent } from './modify/modify.component';
import { ReadComponent } from './read/read.component';
import { SearchPlaygroundComponent } from './search-playground/search-playground.component';
import { SearchResultsComponent } from './search-playground/search-results/search-results.component';
import { StillImagePlaygroundComponent } from './still-image/still-image-playground.component';
import { UploadPlaygroundComponent } from './upload-playground/upload-playground.component';
import { ViewerPlaygroundComponent } from './viewer-playground/viewer-playground.component';


const routes: Routes = [
    { path: '', redirectTo: '/read', pathMatch: 'full' }, // readonly view is the default if no endpoint is specified
    { path: 'read', component: ReadComponent }, // readonly view component
    { path: 'modify', component: ModifyComponent }, // modify view component
    { path: 'action', component: ActionPlaygroundComponent }, // action playground component
    {
        path: 'search',
        component: SearchPlaygroundComponent, // search playground component
        children: [
            {
                path: ':mode/:q',
                component: SearchResultsComponent
            },
            {
                path: ':mode/:q/:project',
                component: SearchResultsComponent
            }
        ]
    },
    { path: 'advanced-search', component: AdvancedSearchPlaygroundComponent }, // advanced search playground component
    { path: 'still-image', component: StillImagePlaygroundComponent }, // still image playground component
    { path: 'viewer', component: ViewerPlaygroundComponent }, // viewer playground component
    { path: 'ckeditor', component: CkeditorPlaygroundComponent }, // CKeditor playground component
    { path: 'upload-file', component: UploadPlaygroundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
