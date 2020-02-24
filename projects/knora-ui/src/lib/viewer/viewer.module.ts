import {NgModule} from '@angular/core';
import {TextValueAsStringComponent} from './values/text-value/text-value-as-string/text-value-as-string.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material';
import {CommonModule} from '@angular/common';
import {IntValueComponent} from './values/int-value/int-value.component';
import {DisplayEditComponent} from './operations/display-edit/display-edit.component';
import {UriValueComponent} from './values/uri-value/uri-value.component';
import {DecimalValueComponent} from './values/decimal-value/decimal-value.component';
import {IntervalValueComponent} from './values/interval-value/interval-value.component';

@NgModule({
  declarations: [TextValueAsStringComponent, IntValueComponent, DisplayEditComponent, DecimalValueComponent, UriValueComponent, IntervalValueComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  exports: [TextValueAsStringComponent, IntValueComponent, DisplayEditComponent, DecimalValueComponent, UriValueComponent, IntervalValueComponent]
})
export class ViewerModule {
}
