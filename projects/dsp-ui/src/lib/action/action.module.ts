import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormattedBooleanPipe } from './pipes/formatted-boolean.pipe';
import { KeyPipe } from './pipes/key.pipe';
import { KnoraDatePipe } from './pipes/knoradate.pipe';
import { ReversePipe } from './pipes/reverse.pipe';
import { SortByPipe } from './pipes/sort-by.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  declarations: [
    FormattedBooleanPipe,
    KeyPipe,
    KnoraDatePipe,
    ReversePipe,
    SortByPipe,
    TruncatePipe,
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
  ]
})

export class DspActionModule { }
