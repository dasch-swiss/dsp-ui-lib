import {NgModule} from '@angular/core';
import {TextValueAsStringComponent} from './values/text-value/text-value-as-string/text-value-as-string.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {CommonModule} from '@angular/common';
import { IntValueComponent } from './values/int-value/int-value.component';
import { LinkValueComponent } from './values/link-value/link-value.component';
import { DisplayEditComponent } from './operations/display-edit/display-edit.component';

@NgModule({
  declarations: [TextValueAsStringComponent, IntValueComponent, DisplayEditComponent, LinkValueComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  exports: [TextValueAsStringComponent, IntValueComponent, DisplayEditComponent, LinkValueComponent]
})
export class ViewerModule {
}
