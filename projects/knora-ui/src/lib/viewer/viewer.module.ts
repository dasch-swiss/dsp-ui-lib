import {NgModule} from '@angular/core';
import {TextValueAsStringComponent} from './values/text-value/text-value-as-string/text-value-as-string.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CommonModule} from '@angular/common';
import { IntValueComponent } from './values/int-value/int-value.component';
import { DisplayEditComponent } from './operations/display-edit/display-edit.component';
import { BooleanValueComponent } from './values/boolean-value/boolean-value.component';
import { DecimalValueComponent } from './values/decimal-value/decimal-value.component';
import { UriValueComponent } from './values/uri-value/uri-value.component';
import {IntervalValueComponent} from './values/interval-value/interval-value.component';
import {IntervalInputComponent} from './values/interval-value/interval-input/interval-input.component';
import { GeonameValueComponent } from './values/geoname-value/geoname-value.component';

@NgModule({
  declarations: [TextValueAsStringComponent, IntValueComponent, DisplayEditComponent, BooleanValueComponent, DecimalValueComponent, UriValueComponent, IntervalValueComponent, IntervalInputComponent, GeonameValueComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule
  ],
  exports: [TextValueAsStringComponent, IntValueComponent, DisplayEditComponent, BooleanValueComponent, DecimalValueComponent, UriValueComponent, IntervalValueComponent, GeonameValueComponent]
})
export class ViewerModule {
}
