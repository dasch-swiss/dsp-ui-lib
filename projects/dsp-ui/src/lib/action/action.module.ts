import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProgressIndicatorComponent } from './components/progress-indicator/progress-indicator.component';
import { AdminImageDirective } from './directives/admin-image/admin-image.directive';
import { ExistingNameDirective } from './directives/existing-names/existing-name.directive';
import { GndDirective } from './directives/gnd/gnd.directive';
import { JdnDatepickerDirective } from './directives/jdn-datepicker/jdn-datepicker.directive';
import { ReversePipe } from './pipes/array-transformation/reverse.pipe';
import { SortByPipe } from './pipes/array-transformation/sort-by.pipe';
import { FormattedBooleanPipe } from './pipes/formatting/formatted-boolean.pipe';
import { KnoraDatePipe } from './pipes/formatting/knoradate.pipe';
import { TruncatePipe } from './pipes/string-transformation/truncate.pipe';
import { MessageComponent } from './components/message/message.component';

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
    MessageComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
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
    MessageComponent
  ]
})

export class DspActionModule { }
