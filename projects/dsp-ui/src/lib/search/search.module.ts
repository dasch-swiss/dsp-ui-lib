import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SelectOntologyComponent } from './advanced-search/select-ontology/select-ontology.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectResourceClassComponent } from './advanced-search/select-resource-class/select-resource-class.component';
import { SelectPropertyComponent } from './advanced-search/select-property/select-property.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpecifyPropertyValueComponent } from './advanced-search/select-property/specify-property-value/specify-property-value.component';
import { SearchIntValueComponent } from './advanced-search/select-property/specify-property-value/search-int-value/search-int-value.component';
import { SearchPanelComponent } from './search-panel/search-panel.component';
import { FulltextSearchComponent } from './fulltext-search/fulltext-search.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SearchBooleanValueComponent } from './advanced-search/select-property/specify-property-value/search-boolean-value/search-boolean-value.component';
import { SearchDateValueComponent } from './advanced-search/select-property/specify-property-value/search-date-value/search-date-value.component';
import { DspViewerModule } from '../viewer';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SearchDecimalValueComponent } from './advanced-search/select-property/specify-property-value/search-decimal-value/search-decimal-value.component';
import { SearchLinkValueComponent } from './advanced-search/select-property/specify-property-value/search-link-value/search-link-value.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SearchListValueComponent } from './advanced-search/select-property/specify-property-value/search-list-value/search-list-value.component';
import { SearchDisplayListComponent } from './advanced-search/select-property/specify-property-value/search-list-value/display-list/search-display-list.component';

@NgModule({
    declarations: [
        SearchPanelComponent,
        FulltextSearchComponent,
        SelectOntologyComponent,
        SelectResourceClassComponent,
        SelectPropertyComponent,
        AdvancedSearchComponent,
        SpecifyPropertyValueComponent,
        SearchIntValueComponent,
        SearchBooleanValueComponent,
        SearchDateValueComponent,
        SearchDecimalValueComponent,
        SearchLinkValueComponent,
        SearchListValueComponent,
        SearchDisplayListComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatMenuModule,
        MatListModule,
        MatButtonModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule,
        MatInputModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        DspViewerModule
    ],
    exports: [
        SearchPanelComponent,
        FulltextSearchComponent,
        AdvancedSearchComponent
    ]
})
export class DspSearchModule {
}
