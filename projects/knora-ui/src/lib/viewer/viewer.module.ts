import {NgModule} from '@angular/core';
import {TextValueAsStringComponent} from './values/text-value/text-value-as-string/text-value-as-string.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CommonModule} from '@angular/common';
import { IntValueComponent } from './values/int-value/int-value.component';
import { LinkValueComponent } from './values/link-value/link-value.component';
import { DisplayEditComponent } from './operations/display-edit/display-edit.component';
import { BooleanValueComponent } from './values/boolean-value/boolean-value.component';
import { DecimalValueComponent } from './values/decimal-value/decimal-value.component';
import { UriValueComponent } from './values/uri-value/uri-value.component';
import {IntervalValueComponent} from './values/interval-value/interval-value.component';
import {IntervalInputComponent} from './values/interval-value/interval-input/interval-input.component';

@NgModule({
  declarations: [TextValueAsStringComponent, IntValueComponent, DisplayEditComponent, LinkValueComponent, BooleanValueComponent,
    DecimalValueComponent, UriValueComponent, IntervalValueComponent, IntervalInputComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCheckboxModule
  ],
  exports: [TextValueAsStringComponent, IntValueComponent, DisplayEditComponent, LinkValueComponent, BooleanValueComponent,
    DecimalValueComponent, UriValueComponent, IntervalValueComponent]

})
export class ViewerModule {
}
