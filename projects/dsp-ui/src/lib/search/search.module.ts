import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SelectOntologyComponent } from './advanced-search/select-ontology/select-ontology.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [SelectOntologyComponent],
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
