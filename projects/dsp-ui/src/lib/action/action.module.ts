import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { MessageComponent } from './components/message/message.component';
import { ProgressIndicatorComponent } from './components/progress-indicator/progress-indicator.component';
import { SortButtonComponent } from './components/sort-button/sort-button.component';
import { StringLiteralInputComponent } from './components/string-literal-input/string-literal-input.component';
import { AdminImageDirective } from './directives/admin-image/admin-image.directive';
import { ExistingNameDirective } from './directives/existing-names/existing-name.directive';
import { GndDirective } from './directives/gnd/gnd.directive';
import { ReversePipe } from './pipes/array-transformation/reverse.pipe';
import { SortByPipe } from './pipes/array-transformation/sort-by.pipe';
import { FormattedBooleanPipe } from './pipes/formatting/formatted-boolean.pipe';
import { KnoraDatePipe } from './pipes/formatting/knoradate.pipe';
import { SanitizeHtmlPipe } from './pipes/sanitization/sanitize-html.pipe';
import { StringifyStringLiteralPipe } from './pipes/string-transformation/stringify-string-literal.pipe';
import { TruncatePipe } from './pipes/string-transformation/truncate.pipe';

@NgModule({
  declarations: [
    FormattedBooleanPipe,
    KnoraDatePipe,
    ReversePipe,
    SortByPipe,
    TruncatePipe,
    StringifyStringLiteralPipe,
    SanitizeHtmlPipe,
    AdminImageDirective,
    ExistingNameDirective,
    GndDirective,
    ProgressIndicatorComponent,
    MessageComponent,
    SortButtonComponent,
    StringLiteralInputComponent,
    LoginFormComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatCardModule,
    MatListModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
  ],
  exports: [
    FormattedBooleanPipe,
    KnoraDatePipe,
    ReversePipe,
    SortByPipe,
    TruncatePipe,
    StringifyStringLiteralPipe,
    SanitizeHtmlPipe,
    AdminImageDirective,
    ExistingNameDirective,
    ProgressIndicatorComponent,
    MessageComponent,
    SortButtonComponent,
    StringLiteralInputComponent,
    LoginFormComponent,
    ConfirmationDialogComponent
  ]
})

export class DspActionModule { }
