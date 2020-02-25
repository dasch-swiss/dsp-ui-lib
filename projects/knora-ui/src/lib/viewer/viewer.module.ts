import {NgModule} from '@angular/core';
import {TextValueAsStringComponent} from './values/text-value/text-value-as-string/text-value-as-string.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CommonModule} from '@angular/common';
import {IntValueComponent} from './values/int-value/int-value.component';
import {DisplayEditComponent} from './operations/display-edit/display-edit.component';
import {BooleanValueComponent} from './values/boolean-value/boolean-value.component';
import {DecimalValueComponent} from './values/decimal-value/decimal-value.component';
import {UriValueComponent} from './values/uri-value/uri-value.component';
import {IntervalValueComponent} from './values/interval-value/interval-value.component';
import {IntervalInputComponent} from './values/interval-value/interval-input/interval-input.component';
import {DateValueComponent} from './values/date-value/date-value.component';
import {MatDatepickerModule} from '@angular/material';
import {MatJDNConvertibleCalendarDateAdapterModule} from 'jdnconvertiblecalendardateadapter';
import { JDNDatepickerDirective } from './values/date-value/jdn-datepicker-directive/jdndatepicker.directive';
import { DateInputComponent } from './values/date-value/date-input/date-input.component';

@NgModule({
  declarations: [TextValueAsStringComponent, IntValueComponent, DisplayEditComponent, BooleanValueComponent, DecimalValueComponent, UriValueComponent, IntervalValueComponent, IntervalInputComponent, DateValueComponent, JDNDatepickerDirective, DateInputComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatJDNConvertibleCalendarDateAdapterModule
  ],
  exports: [TextValueAsStringComponent, IntValueComponent, DisplayEditComponent, BooleanValueComponent, DecimalValueComponent, UriValueComponent, IntervalValueComponent, DateValueComponent, JDNDatepickerDirective]
})
export class ViewerModule {
}
