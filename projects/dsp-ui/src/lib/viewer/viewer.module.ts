import { NgModule } from '@angular/core';
import { TextValueAsStringComponent } from './values/text-value/text-value-as-string/text-value-as-string.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { MatJDNConvertibleCalendarDateAdapterModule } from 'jdnconvertiblecalendardateadapter';

import { IntValueComponent } from './values/int-value/int-value.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LinkValueComponent } from './values/link-value/link-value.component';
import { DisplayEditComponent } from './operations/display-edit/display-edit.component';
import { BooleanValueComponent } from './values/boolean-value/boolean-value.component';
import { DecimalValueComponent } from './values/decimal-value/decimal-value.component';
import { ColorValueComponent } from './values/color-value/color-value.component';
import { UriValueComponent } from './values/uri-value/uri-value.component';
import { ListValueComponent } from './values/list-value/list-value.component';
import { SublistValueComponent } from './values/list-value/subList-value/sublist-value.component';
import { IntervalValueComponent } from './values/interval-value/interval-value.component';
import { IntervalInputComponent } from './values/interval-value/interval-input/interval-input.component';
import { GeonameValueComponent } from './values/geoname-value/geoname-value.component';
import { TextValueAsHtmlComponent } from './values/text-value/text-value-as-html/text-value-as-html.component';
import { TimeValueComponent } from './values/time-value/time-value.component';
import { TimeInputComponent } from './values/time-value/time-input/time-input.component';
import { PropertyViewComponent } from './views/property-view/property-view.component';
import { ResourceViewComponent } from './views/resource-view/resource-view.component';
import { ColorPickerComponent } from './values/color-value/color-picker/color-picker.component';
import { DateValueComponent } from './values/date-value/date-value.component';
import { CalendarHeaderComponent } from './values/date-value/calendar-header/calendar-header.component';
import { DateInputComponent } from './values/date-value/date-input/date-input.component';
import { JDNDatepickerDirective } from './values/jdn-datepicker-directive/jdndatepicker.directive';
import { DspActionModule } from '../action';


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
        JDNDatepickerDirective,
        PropertyViewComponent,
        ResourceViewComponent,
        ColorValueComponent,
        ColorPickerComponent,
        DateValueComponent,
        DateInputComponent,
        CalendarHeaderComponent,
        LinkValueComponent,
        ListValueComponent,
        SublistValueComponent,
        GeonameValueComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatOptionModule,
        MatSelectModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatIconModule,
        MatJDNConvertibleCalendarDateAdapterModule,
        MatMenuModule,
        ClipboardModule,
        ColorPickerModule,
        DspActionModule
    ],
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
        LinkValueComponent,
        PropertyViewComponent,
        ResourceViewComponent,
        ListValueComponent,
        GeonameValueComponent,
    ]
})
export class DspViewerModule {
}
