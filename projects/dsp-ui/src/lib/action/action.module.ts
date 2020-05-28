import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormattedBooleanPipe } from './pipes/formatting/formatted-boolean.pipe';
import { KnoraDatePipe } from './pipes/formatting/knoradate.pipe';
import { ReversePipe } from './pipes/array-transformation/reverse.pipe';
import { SortByPipe } from './pipes/array-transformation/sort-by.pipe';
import { TruncatePipe } from './pipes/string-transformation/truncate.pipe';
import { AdminImageDirective } from './directives/admin-image.directive';
import { ExistingNameDirective } from './directives/existing-name.directive';

@NgModule({
  declarations: [
    FormattedBooleanPipe,
    KnoraDatePipe,
    ReversePipe,
    SortByPipe,
    TruncatePipe,
    AdminImageDirective,
    ExistingNameDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FormattedBooleanPipe,
    KnoraDatePipe,
    ReversePipe,
    SortByPipe,
    TruncatePipe,
    AdminImageDirective,
    ExistingNameDirective
  ]
})

export class DspActionModule { }
