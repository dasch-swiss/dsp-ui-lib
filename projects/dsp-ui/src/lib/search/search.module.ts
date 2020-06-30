import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ExpertSearchComponent } from './expert-search/expert-search.component';
import { FulltextSearchComponent } from './fulltext-search/fulltext-search.component';
import { SearchPanelComponent } from './search-panel/search-panel.component';



@NgModule({
    declarations: [
        SearchPanelComponent,
        FulltextSearchComponent,
        ExpertSearchComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatMenuModule,
        MatListModule,
        MatButtonModule,
        MatTooltipModule
    ],
    exports: [
        SearchPanelComponent,
        FulltextSearchComponent,
        ExpertSearchComponent
    ]
})
export class DspSearchModule { }
