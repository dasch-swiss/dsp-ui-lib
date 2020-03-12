import { Component, HostBinding, Input, Optional, Self, ElementRef, DoCheck, OnDestroy } from '@angular/core';
import { ErrorStateMatcher, CanUpdateErrorStateCtor, mixinErrorState, MatFormFieldControl, CanUpdateErrorState } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, NgControl, FormGroup, FormBuilder, Validators, ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import {JDNConvertibleCalendarModule} from 'jdnconvertiblecalendar/dist/src/JDNConvertibleCalendar';
import GregorianCalendarDate = JDNConvertibleCalendarModule.GregorianCalendarDate;
import CalendarPeriod = JDNConvertibleCalendarModule.CalendarPeriod;
import {CalendarDate} from 'jdnconvertiblecalendar';
import { CustomRegex } from '../../custom-regex';
import { DatePipe } from '@angular/common';

/** Error when invalid control is dirty, touched, or submitted. */
export class TimeInputErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

class MatInputBase {
  constructor(public _defaultErrorStateMatcher: ErrorStateMatcher,
              public _parentForm: NgForm,
              public _parentFormGroup: FormGroupDirective,
              public ngControl: NgControl) {}
}
const _MatInputMixinBase: CanUpdateErrorStateCtor & typeof MatInputBase =
  mixinErrorState(MatInputBase);

@Component({
  selector: 'kui-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss'],
  providers: [{provide: MatFormFieldControl, useExisting: TimeInputComponent}]
})
export class TimeInputComponent extends _MatInputMixinBase implements ControlValueAccessor, MatFormFieldControl<string>, DoCheck, CanUpdateErrorState, OnDestroy{

  static nextId = 0;

  form: FormGroup;
  stateChanges = new Subject<void>();
  @HostBinding() id = `kui-time-input-${TimeInputComponent.nextId++}`;
  focused = false;
  errorState = false;
  controlType = 'kui-time-input';
  matcher = new TimeInputErrorStateMatcher();
  onChange = (_: any) => {};
  onTouched = () => {};

  @Input() dateLabel = 'date';
  @Input() timeLabel = 'time';

  dateFormControl: FormControl;

  timeValidator = [Validators.pattern(CustomRegex.TIME_REGEX)];
  timeFormControl: FormControl;

  datePipe = new DatePipe('en-US');

  get empty() {
    const userInput = this.form.value;
    return !userInput.date && !userInput.time;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get required() {
    return this._required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  
  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.form.disable() : this.form.enable();
    this.stateChanges.next();
  }

  private _disabled = false;

  @Input()
  get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  private _placeholder: string;

  @Input() readonly = false;

  @HostBinding('attr.aria-describedby') describedBy = '';

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  @Input()
  get value(): string | null {
    const userInput = this.form.value;
    if (userInput.date !== null && userInput.time !== null) {
      let splitTime = userInput.time.split(":");
      const updateDate = new Date(userInput.date.calendarStart.year,
                                 (userInput.date.calendarStart.month - 1),
                                 userInput.date.calendarStart.day,
                                 splitTime[0],
                                 splitTime[1]
      );

      // return converted Date obj as a string without the milliseconds
      return updateDate.toISOString().split('.')[0]+"Z";
    }
    return null;
  }

  set value(datetime: string | null) {
    if (datetime !== null) {
      const calendarDate = new CalendarDate(Number(this.datePipe.transform(datetime, "y")),
                                            Number(this.datePipe.transform(datetime, "M")),
                                            Number(this.datePipe.transform(datetime, "d")));

      const gcd = new GregorianCalendarDate(new CalendarPeriod(calendarDate, calendarDate));

      const timeVal = this.datePipe.transform(datetime, "HH:mm");

      this.form.setValue({date: gcd, time: timeVal});
    } else {
      this.form.setValue({date: null, time: null});
    }
    this.stateChanges.next();
  }

  @Input() errorStateMatcher: ErrorStateMatcher;

  constructor(fb: FormBuilder,
              @Optional() @Self() public ngControl: NgControl,
              private fm: FocusMonitor,
              private elRef: ElementRef<HTMLElement>,
              @Optional() _parentForm: NgForm,
              @Optional() _parentFormGroup: FormGroupDirective,
              _defaultErrorStateMatcher: ErrorStateMatcher) { 

    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);

    this.dateFormControl = new FormControl(null);
    this.dateFormControl.setValidators([Validators.required]);
    
    this.timeFormControl = new FormControl({value: null, Validators: [Validators.required, this.timeValidator]});

    this.form = fb.group({
      date: this.dateFormControl,
      time: this.timeFormControl
    });

    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }

  writeValue(datetime: string | null): void {
    this.value = datetime;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _handleInput(): void {
    this.onChange(this.value);
  }

}
