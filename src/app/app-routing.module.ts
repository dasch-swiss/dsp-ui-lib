import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourceViewComponent } from 'projects/knora-ui/src/lib/viewer';
import { ModifyComponent } from './modify/modify.component';
import { ReadComponent } from './read/read.component';


const routes: Routes = [
  { path: '', redirectTo: '/read', pathMatch: 'full' }, //readonly view is the default if no endpoint is specified
  { path: 'read', component: ReadComponent }, // readonly view component
  { path: 'modify', component: ModifyComponent} // modify view component
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
