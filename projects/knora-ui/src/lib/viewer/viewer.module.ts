import {NgModule} from '@angular/core';
import {TextValueAsStringComponent} from './values/text-value/text-value-as-string/text-value-as-string.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material';
import {CommonModule} from '@angular/common';
import { IntValueComponent } from './values/int-value/int-value.component';
import { DisplayEditComponent } from './operations/display-edit/display-edit.component';
import { UriValueComponent } from './values/uri-value/uri-value.component';

@NgModule({
  declarations: [TextValueAsStringComponent, IntValueComponent, DisplayEditComponent, UriValueComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  exports: [TextValueAsStringComponent, IntValueComponent, DisplayEditComponent]
})
export class ViewerModule {
}
