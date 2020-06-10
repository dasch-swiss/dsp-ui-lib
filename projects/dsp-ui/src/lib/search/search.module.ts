import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { SearchPanelComponent } from './search-panel/search-panel.component';

@NgModule({
    declarations: [
        SearchPanelComponent
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatMenuModule
    ],
    exports: [
        SearchPanelComponent
    ]
})
export class DspSearchModule { }
