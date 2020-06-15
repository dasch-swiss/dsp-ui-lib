import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SelectOntologyComponent } from './advanced-search/select-ontology/select-ontology.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectResourceClassComponent } from './advanced-search/select-resource-class/select-resource-class.component';

@NgModule({
    declarations: [
        SelectOntologyComponent,
        SelectResourceClassComponent],
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
