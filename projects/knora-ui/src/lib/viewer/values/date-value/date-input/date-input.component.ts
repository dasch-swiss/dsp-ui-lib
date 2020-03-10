import {Component, DoCheck, ElementRef, HostBinding, Input, OnDestroy, Optional, Self} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgControl, NgForm, Validators} from '@angular/forms';
import {MatFormFieldControl} from '@angular/material/form-field';
import {KnoraDate, KnoraPeriod} from '@knora/api';
import {CanUpdateErrorState, CanUpdateErrorStateCtor, ErrorStateMatcher, mixinErrorState} from '@angular/material/core';
import {Subject} from 'rxjs';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {FocusMonitor} from '@angular/cdk/a11y';
import {JDNConvertibleCalendarModule} from 'jdnconvertiblecalendar/dist/src/JDNConvertibleCalendar';
import {CalendarDate} from 'jdnconvertiblecalendar';
import GregorianCalendarDate = JDNConvertibleCalendarModule.GregorianCalendarDate;
import CalendarPeriod = JDNConvertibleCalendarModule.CalendarPeriod;

/** Error when invalid control is dirty, touched, or submitted. */
export class DateInputErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

class MatInputBase {
  constructor(public _defaultErrorStateMatcher: ErrorStateMatcher,
              public _parentForm: NgForm,
              public _parentFormGroup: FormGroupDirective,
              public ngControl: NgControl) {
  }
}

const _MatInputMixinBase: CanUpdateErrorStateCtor & typeof MatInputBase =
  mixinErrorState(MatInputBase);

@Component({
  selector: 'kui-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  providers: [{provide: MatFormFieldControl, useExisting: DateInputComponent}]
})
export class DateInputComponent extends _MatInputMixinBase implements ControlValueAccessor, MatFormFieldControl<KnoraDate | KnoraPeriod>, DoCheck, CanUpdateErrorState, OnDestroy {

  static nextId = 0;

  form: FormGroup;
  stateChanges = new Subject<void>();
  @HostBinding() id = `kui-date-input-${DateInputComponent.nextId++}`;
  focused = false;
  errorState = false;
  controlType = 'kui-date-input';
  matcher = new DateInputErrorStateMatcher();

  period: boolean;
  startCalendarName = 'Gregorian';
  endCalendarName?;

  onChange = (_: any) => {
  };
  onTouched = () => {
  };

  get empty() {
    const userInput = this.form.value;
    return !userInput.start && !userInput.end;
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
  get value(): KnoraDate | KnoraPeriod | null {
    const userInput = this.form.value;
    if (!this.period) {
      // single date
      if (userInput.dateStart !== null) {
        return new KnoraDate(userInput.dateStart.calendarName.toUpperCase(), 'CE', userInput.dateStart.calendarStart.year, userInput.dateStart.calendarStart.month, userInput.dateStart.calendarStart.day);
      } else {
        return null;
      }
    } else {
      // period
      if (userInput.dateStart !== null && userInput.dateEnd !== null) {
        const start = new KnoraDate(userInput.dateStart.calendarName.toUpperCase(), 'CE', userInput.dateStart.calendarStart.year, userInput.dateStart.calendarStart.month, userInput.dateStart.calendarStart.day);
        const end = new KnoraDate(userInput.dateEnd.calendarName.toUpperCase(), 'CE', userInput.dateEnd.calendarStart.year, userInput.dateEnd.calendarStart.month, userInput.dateEnd.calendarStart.day);
        return new KnoraPeriod(start, end);
      } else {
        return null;
      }
    }
  }

  set value(date: KnoraDate | KnoraPeriod | null) {
    if (date !== null) {
      if (date instanceof KnoraDate) {
        // single date
        // TODO: set correct calendar
        const calendarDate = new CalendarDate(date.year, date.month, date.day);

        // determine calendar


        this.form.setValue({
          dateStart: new GregorianCalendarDate(new CalendarPeriod(calendarDate, calendarDate)),
          dateEnd: null
        });
        this.period = false;
        this.startCalendarName = this.form.controls.dateStart.value.calendarName;
        this.endCalendarName = undefined;
      } else {
        // period
        const period = (date as KnoraPeriod);
        const calendarDateStart = new CalendarDate(period.start.year, period.start.month, period.start.day);
        const calendarDateEnd = new CalendarDate(period.end.year, period.end.month, period.end.day);

        this.form.setValue({
          dateStart: new GregorianCalendarDate(new CalendarPeriod(calendarDateStart, calendarDateStart)),
          dateEnd: new GregorianCalendarDate(new CalendarPeriod(calendarDateEnd, calendarDateEnd))
        });

        this.period = true;
        this.startCalendarName = this.form.controls.dateStart.value.calendarName;
        this.endCalendarName = this.form.controls.dateEnd.value.calendarName;
      }
    } else {
      this.form.setValue({dateStart: null, dateEnd: null});

      this.period = false;
      this.startCalendarName = 'Gregorian';
      this.endCalendarName = undefined;
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


    this.form = fb.group({
      dateStart: [null, Validators.required],
      dateEnd: [null]
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

  writeValue(date: KnoraDate | KnoraPeriod | null): void {
    this.value = date;
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
