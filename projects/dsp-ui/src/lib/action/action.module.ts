import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyPipe } from './pipes/key.pipe';
import { ReversePipe } from './pipes/reverse.pipe';
import { SortByPipe } from './pipes/sort-by.pipe';
import { StringifyStringLiteralPipe } from './pipes/stringify-string-literal.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { KnoraDatePipe } from './pipes/knoradate.pipe';

@NgModule({
  declarations: [
    KeyPipe,
    ReversePipe,
    SortByPipe,
    StringifyStringLiteralPipe,
    TruncatePipe,
    KnoraDatePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    KeyPipe,
    ReversePipe,
    SortByPipe,
    StringifyStringLiteralPipe,
    TruncatePipe,
    KnoraDatePipe
  ]
})

export class DspActionModule { }
