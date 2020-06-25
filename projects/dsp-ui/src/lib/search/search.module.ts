import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FulltextSearchComponent } from './fulltext-search/fulltext-search.component';
import { SearchPanelComponent } from './search-panel/search-panel.component';

@NgModule({
    declarations: [
        SearchPanelComponent,
        FulltextSearchComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatMenuModule,
        MatListModule,
        MatButtonModule,
        MatTooltipModule
    ],
    exports: [
        SearchPanelComponent,
        FulltextSearchComponent
    ]
})
export class DspSearchModule { }
