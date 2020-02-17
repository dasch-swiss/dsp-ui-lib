import {NgModule} from '@angular/core';
import {TextValueAsStringComponent} from './values/text-value/text-value-as-string/text-value-as-string.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material';
import {CommonModule} from '@angular/common';
import { IntValueComponent } from './values/int-value/int-value.component';
import { DisplayEditComponent } from './operations/display-edit/display-edit.component';
import { IntervalValueComponent } from './values/interval-value/interval-value.component';
import { InvertalInputComponent } from './values/interval-value/invertal-input/invertal-input.component';

@NgModule({
  declarations: [TextValueAsStringComponent, IntValueComponent, DisplayEditComponent, IntervalValueComponent, InvertalInputComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  exports: [TextValueAsStringComponent, IntValueComponent, IntervalValueComponent, DisplayEditComponent]
})
export class ViewerModule {
}
