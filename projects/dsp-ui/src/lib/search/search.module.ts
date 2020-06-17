import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SelectOntologyComponent } from './advanced-search/select-ontology/select-ontology.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectResourceClassComponent } from './advanced-search/select-resource-class/select-resource-class.component';
import { SelectPropertyComponent } from './advanced-search/select-property/select-property.component';

@NgModule({
    declarations: [
        SelectOntologyComponent,
        SelectResourceClassComponent,
        SelectPropertyComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatOptionModule
    ],
    exports: []
})
export class DspSearchModule {
}
