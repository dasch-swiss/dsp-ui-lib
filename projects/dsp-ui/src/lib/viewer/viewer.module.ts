import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatJDNConvertibleCalendarDateAdapterModule } from 'jdnconvertiblecalendardateadapter';
import { ColorPickerModule } from 'ngx-color-picker';
import { DspActionModule } from '../action';
import { AddValueComponent } from './operations/add-value/add-value.component';
import { DisplayEditComponent } from './operations/display-edit/display-edit.component';
import { StillImageComponent } from './representation/still-image/still-image.component';
import { BooleanValueComponent } from './values/boolean-value/boolean-value.component';
import { ColorPickerComponent } from './values/color-value/color-picker/color-picker.component';
import { ColorValueComponent } from './values/color-value/color-value.component';
import { CalendarHeaderComponent } from './values/date-value/calendar-header/calendar-header.component';
import { DateInputComponent } from './values/date-value/date-input/date-input.component';
import { DateValueComponent } from './values/date-value/date-value.component';
import { DecimalValueComponent } from './values/decimal-value/decimal-value.component';
import { GeonameValueComponent } from './values/geoname-value/geoname-value.component';
import { IntValueComponent } from './values/int-value/int-value.component';
import { IntervalInputComponent } from './values/interval-value/interval-input/interval-input.component';
import { IntervalValueComponent } from './values/interval-value/interval-value.component';
import { JDNDatepickerDirective } from './values/jdn-datepicker-directive/jdndatepicker.directive';
import { LinkValueComponent } from './values/link-value/link-value.component';
import { ListValueComponent } from './values/list-value/list-value.component';
import { SublistValueComponent } from './values/list-value/subList-value/sublist-value.component';
import { TextValueAsHtmlComponent } from './values/text-value/text-value-as-html/text-value-as-html.component';
import { TextValueAsStringComponent } from './values/text-value/text-value-as-string/text-value-as-string.component';
import { TimeInputComponent } from './values/time-value/time-input/time-input.component';
import { TimeValueComponent } from './values/time-value/time-value.component';
import { UriValueComponent } from './values/uri-value/uri-value.component';
import { ListViewComponent } from './views/list-view/list-view.component';
import { ResourceGridComponent } from './views/list-view/resource-grid/resource-grid.component';
import { ResourceListComponent } from './views/list-view/resource-list/resource-list.component';
import { PropertyToolbarComponent } from './views/property-view/property-toolbar/property-toolbar.component';
import { PropertyViewComponent } from './views/property-view/property-view.component';
import { ResourceViewComponent } from './views/resource-view/resource-view.component';

@NgModule({
    declarations: [
        AddValueComponent,
        BooleanValueComponent,
        CalendarHeaderComponent,
        ColorPickerComponent,
        ColorValueComponent,
        DateInputComponent,
        DateValueComponent,
        DecimalValueComponent,
        DisplayEditComponent,
        GeonameValueComponent,
        IntervalInputComponent,
        IntervalValueComponent,
        IntValueComponent,
        JDNDatepickerDirective,
        LinkValueComponent,
        ListValueComponent,
        ListViewComponent,
        PropertyToolbarComponent,
        PropertyViewComponent,
        ResourceGridComponent,
        ResourceListComponent,
        ResourceViewComponent,
        StillImageComponent,
        SublistValueComponent,
        TextValueAsHtmlComponent,
        TextValueAsStringComponent,
        TimeInputComponent,
        TimeValueComponent,
        UriValueComponent
    ],
    imports: [
        ClipboardModule,
        ColorPickerModule,
        CommonModule,
        DspActionModule,
        FormsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatIconModule,
        MatInputModule,
        MatJDNConvertibleCalendarDateAdapterModule,
        MatListModule,
        MatMenuModule,
        MatOptionModule,
        MatPaginatorModule,
        MatSelectModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatTooltipModule,
        ReactiveFormsModule
    ],
    exports: [
        AddValueComponent,
        BooleanValueComponent,
        ColorValueComponent,
        DateValueComponent,
        DecimalValueComponent,
        DisplayEditComponent,
        GeonameValueComponent,
        IntervalValueComponent,
        IntValueComponent,
        JDNDatepickerDirective,
        LinkValueComponent,
        ListValueComponent,
        ListViewComponent,
        PropertyViewComponent,
        ResourceGridComponent,
        ResourceListComponent,
        ResourceViewComponent,
        StillImageComponent,
        TextValueAsHtmlComponent,
        TextValueAsStringComponent,
        TimeValueComponent,
        UriValueComponent
    ]
})
export class DspViewerModule {
}
