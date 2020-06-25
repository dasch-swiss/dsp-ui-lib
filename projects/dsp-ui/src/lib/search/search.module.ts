import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SelectOntologyComponent } from './advanced-search/select-ontology/select-ontology.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectResourceClassComponent } from './advanced-search/select-resource-class/select-resource-class.component';
import { SelectPropertyComponent } from './advanced-search/select-property/select-property.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpecifyPropertyValueComponent } from './advanced-search/select-property/specifiy-property-value/specify-property-value.component';
import { SearchIntValueComponent } from './advanced-search/select-property/specify-property-value/integer-value/search-int-value.component';

@NgModule({
    declarations: [
        SelectOntologyComponent,
        SelectResourceClassComponent,
        SelectPropertyComponent,
        AdvancedSearchComponent,
        SpecifyPropertyValueComponent,
        SearchIntValueComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatOptionModule,
        MatIconModule,
        MatCheckboxModule,
        MatTooltipModule
    ],
    exports: [
        AdvancedSearchComponent
    ]
})
export class DspSearchModule {
}
