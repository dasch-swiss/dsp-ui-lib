import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormattedBooleanPipe } from './pipes/formatting/formatted-boolean.pipe';
import { KnoraDatePipe } from './pipes/formatting/knoradate.pipe';
import { ReversePipe } from './pipes/array-transformation/reverse.pipe';
import { SortByPipe } from './pipes/array-transformation/sort-by.pipe';
import { TruncatePipe } from './pipes/string-transformation/truncate.pipe';

@NgModule({
  declarations: [
    FormattedBooleanPipe,
    KnoraDatePipe,
    ReversePipe,
    SortByPipe,
    TruncatePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FormattedBooleanPipe,
    KnoraDatePipe,
    ReversePipe,
    SortByPipe,
    TruncatePipe
  ]
})

export class DspActionModule { }
