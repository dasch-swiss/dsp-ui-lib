import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MessageComponent } from './components/message/message.component';
import { ProgressIndicatorComponent } from './components/progress-indicator/progress-indicator.component';
import { SortButtonComponent } from './components/sort-button/sort-button.component';
import { AdminImageDirective } from './directives/admin-image/admin-image.directive';
import { ExistingNameDirective } from './directives/existing-names/existing-name.directive';
import { GndDirective } from './directives/gnd/gnd.directive';
import { JdnDatepickerDirective } from './directives/jdn-datepicker/jdn-datepicker.directive';
import { ReversePipe } from './pipes/array-transformation/reverse.pipe';
import { SortByPipe } from './pipes/array-transformation/sort-by.pipe';
import { FormattedBooleanPipe } from './pipes/formatting/formatted-boolean.pipe';
import { KnoraDatePipe } from './pipes/formatting/knoradate.pipe';
import { TruncatePipe } from './pipes/string-transformation/truncate.pipe';

@NgModule({
  declarations: [
    FormattedBooleanPipe,
    KnoraDatePipe,
    ReversePipe,
    SortByPipe,
    TruncatePipe,
    AdminImageDirective,
    ExistingNameDirective,
    GndDirective,
    JdnDatepickerDirective,
    ProgressIndicatorComponent,
    MessageComponent,
    SortButtonComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatListModule
  ],
  exports: [
    FormattedBooleanPipe,
    KnoraDatePipe,
    ReversePipe,
    SortByPipe,
    TruncatePipe,
    AdminImageDirective,
    ExistingNameDirective,
    JdnDatepickerDirective,
    ProgressIndicatorComponent,
    MessageComponent,
    SortButtonComponent
  ]
})

export class DspActionModule { }
