import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormattedBooleanPipe } from './pipes/formatting/formatted-boolean.pipe';
import { KeyPipe } from './pipes/array-transformation/key.pipe';
import { KnoraDatePipe } from './pipes/formatting/knoradate.pipe';
import { ReversePipe } from './pipes/array-transformation/reverse.pipe';
import { SortByPipe } from './pipes/array-transformation/sort-by.pipe';
import { TruncatePipe } from './pipes/string-transformation/truncate.pipe';
import { SortingService } from './services/sorting.service';

@NgModule({
  declarations: [
    FormattedBooleanPipe,
    KeyPipe,
    KnoraDatePipe,
    ReversePipe,
    SortByPipe,
    TruncatePipe,
    SortingService
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FormattedBooleanPipe,
    KeyPipe,
    KnoraDatePipe,
    ReversePipe,
    SortByPipe,
    TruncatePipe,
    SortingService
  ]
})

export class DspActionModule { }
