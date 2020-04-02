import {NgModule} from '@angular/core';
import {TextValueAsStringComponent} from './values/text-value/text-value-as-string/text-value-as-string.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CommonModule} from '@angular/common';
import {ColorPickerModule} from 'ngx-color-picker';
import {IntValueComponent} from './values/int-value/int-value.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {LinkValueComponent} from './values/link-value/link-value.component';
import {DisplayEditComponent} from './operations/display-edit/display-edit.component';
import {BooleanValueComponent} from './values/boolean-value/boolean-value.component';
import {DecimalValueComponent} from './values/decimal-value/decimal-value.component';
import {ColorValueComponent} from './values/color-value/color-value.component';
import {UriValueComponent} from './values/uri-value/uri-value.component';
import {IntervalValueComponent} from './values/interval-value/interval-value.component';
import {IntervalInputComponent} from './values/interval-value/interval-input/interval-input.component';
import {TextValueAsHtmlComponent} from './values/text-value/text-value-as-html/text-value-as-html.component';
import {TimeValueComponent} from './values/time-value/time-value.component';
import {TimeInputComponent} from './values/time-value/time-input/time-input.component';
import {MatDatepickerModule} from '@angular/material';
import {MatJDNConvertibleCalendarDateAdapterModule} from 'jdnconvertiblecalendardateadapter';
import {ColorPickerComponent} from './values/color-value/color-picker/color-picker.component';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {DateValueComponent} from './values/date-value/date-value.component';
import {CalendarHeaderComponent} from './values/date-value/calendar-header/calendar-header.component';
import {DateInputComponent} from './values/date-value/date-input/date-input.component';
import {JDNDatepickerDirective} from './values/jdn-datepicker-directive/jdndatepicker.directive';

@NgModule({
  declarations: [
    TextValueAsStringComponent,
    TextValueAsHtmlComponent,
    IntValueComponent,
    DisplayEditComponent,
    BooleanValueComponent,
    DecimalValueComponent,
    UriValueComponent,
    IntervalValueComponent,
    IntervalInputComponent,
    TimeValueComponent,
    TimeInputComponent,
    ColorValueComponent,
    ColorPickerComponent,
    DateValueComponent,
    JDNDatepickerDirective,
    DateInputComponent,
    CalendarHeaderComponent,
    ColorValueComponent,
    ColorPickerComponent,
    LinkValueComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatJDNConvertibleCalendarDateAdapterModule,
    ColorPickerModule
  ],
  entryComponents: [CalendarHeaderComponent],
  exports: [
    TextValueAsStringComponent,
    TextValueAsHtmlComponent,
    IntValueComponent,
    DisplayEditComponent,
    BooleanValueComponent,
    ColorValueComponent,
    DecimalValueComponent,
    UriValueComponent,
    IntervalValueComponent,
    TimeValueComponent,
    DateValueComponent,
    LinkValueComponent
  ]
})
export class ViewerModule {
}
