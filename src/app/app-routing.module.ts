import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionPlaygroundComponent } from './action-playground/action-playground.component';
import { ModifyComponent } from './modify/modify.component';
import { ReadComponent } from './read/read.component';
import { SearchPlaygroundComponent } from './search-playground/search-playground.component';
import { SearchResultsComponent } from './search-playground/search-results/search-results.component';


const routes: Routes = [
  { path: '', redirectTo: '/read', pathMatch: 'full' }, // readonly view is the default if no endpoint is specified
  { path: 'read', component: ReadComponent }, // readonly view component
  { path: 'modify', component: ModifyComponent}, // modify view component
  { path: 'action', component: ActionPlaygroundComponent}, // action playground component
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
