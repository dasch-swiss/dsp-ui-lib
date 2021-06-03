import { Component, DoCheck, ElementRef, HostBinding, Input, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import {
    CanUpdateErrorState,
    CanUpdateErrorStateCtor,
    ErrorStateMatcher,
    mixinErrorState
} from '@angular/material/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormBuilder,
    FormControl,
    FormGroup,
    FormGroupDirective,
    NgControl,
    NgForm, ValidatorFn,
    Validators
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import {
    CalendarDate,
    CalendarPeriod,
    GregorianCalendarDate,
    IslamicCalendarDate,
    JDNConvertibleCalendar,
    JulianCalendarDate
} from 'jdnconvertiblecalendar';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { KnoraDate, KnoraPeriod, Precision } from '@dasch-swiss/dsp-js';

/**
 * Calculates the number of days in a month for a given date.
 *
 * @param calendar the date's calendar.
 * @param year the date's year.
 * @param month the date's month.
 */
function calculateDaysInMonth(calendar: string, year: number, month: number): number {
    const date = new CalendarDate(year, month, 1);
    if (calendar === 'Gregorian') {
        const calDate = new GregorianCalendarDate(new CalendarPeriod(date, date));
        return calDate.daysInMonth(date);
    } else if (calendar === 'Julian') {
        const calDate = new JulianCalendarDate(new CalendarPeriod(date, date));
        return calDate.daysInMonth(date);
    } else if (calendar === 'Islamic') {
        const calDate = new IslamicCalendarDate(new CalendarPeriod(date, date));
        return calDate.daysInMonth(date);
    } else {
        throw Error('Unknown calendar ' + calendar);
    }

}

/**
 * Given a Knora calendar date, creates a JDN calendar date
 * taking into account precision.
 *
 * @param date the Knora calendar date.
 */
function createJDNCalendarDateFromKnoraDate(date: KnoraDate): JDNConvertibleCalendar {

    let calPeriod: CalendarPeriod;

    // TODO: exclude Islamic calendar date?
    let yearAstro: number = date.year;
    if (date.era === 'BCE') {
        // convert historical date to astronomical date
        yearAstro = (yearAstro * -1) + 1;
    }

    if (date.precision === Precision.dayPrecision) {

        calPeriod = new CalendarPeriod(
            new CalendarDate(yearAstro, date.month, date.day),
            new CalendarDate(yearAstro, date.month, date.day)
        );

    } else if (date.precision === Precision.monthPrecision) {

        calPeriod = new CalendarPeriod(
            new CalendarDate(yearAstro, date.month, 1),
            new CalendarDate(yearAstro, date.month, calculateDaysInMonth(date.calendar, date.year, date.month))
        );

    } else if (date.precision === Precision.yearPrecision) {

        calPeriod = new CalendarPeriod(
            new CalendarDate(yearAstro, 1, 1),
            new CalendarDate(yearAstro, 12, calculateDaysInMonth(date.calendar, date.year, 12))
        );

    } else {
        throw Error('Invalid precision');
    }

    if (date.calendar === 'Gregorian') {
        return new GregorianCalendarDate(calPeriod);
    } else if (date.calendar === 'Julian') {
        return new JulianCalendarDate(calPeriod);
    } else if (date.calendar === 'Islamic') {
        return new IslamicCalendarDate(calPeriod);
    } else {
        throw Error('Invalid calendar');
    }

}

/** If a period is defined, start date must be before end date */
export function periodStartEndValidator(isPeriod: FormControl, endDate: FormControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {

        if (isPeriod.value && control.value !== null && endDate.value !== null) {
            // period: check if start is before end

            const jdnStartDate = createJDNCalendarDateFromKnoraDate(control.value);
            const jdnEndDate = createJDNCalendarDateFromKnoraDate(endDate.value);

            const invalid = jdnStartDate.toJDNPeriod().periodEnd >= jdnEndDate.toJDNPeriod().periodStart;

            return invalid ? { 'periodStartEnd': { value: control.value } } : null;

        }

        return null;
    };
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
    selector: 'dsp-date-input-text',
    templateUrl: './date-input-text.component.html',
    styleUrls: ['./date-input-text.component.scss'],
    providers: [{provide: MatFormFieldControl, useExisting: DateInputTextComponent}]
})
export class DateInputTextComponent extends _MatInputMixinBase implements ControlValueAccessor, MatFormFieldControl<KnoraDate | KnoraPeriod>, DoCheck, CanUpdateErrorState, OnInit, OnDestroy, OnInit {

    static nextId = 0;

    @Input() valueRequiredValidator = true;

    form: FormGroup;
    stateChanges = new Subject<void>();

    isPeriodControl: FormControl;
    calendarControl: FormControl;
    startDate: FormControl;
    endDate: FormControl;

    readonly focused = false;

    readonly controlType = 'dsp-date-input-text';

    calendars = JDNConvertibleCalendar.supportedCalendars.map(cal => cal.toUpperCase());

    @Input()
    get value(): KnoraDate | KnoraPeriod | null {

        if (!this.form.valid) {
            return null;
        }

        if (!this.isPeriodControl.value) {
            return this.startDate.value;
        } else {
            if (this.startDate.value.calendar !== this.endDate.value.calendar) {
                return null;
            }

            return new KnoraPeriod(this.startDate.value, this.endDate.value);
        }
    }

    set value(date: KnoraDate | KnoraPeriod | null) {

        // TODO: disable era for Islamic calendar dates?

        if (date instanceof KnoraDate) {
            // single date
            this.calendarControl.setValue(date.calendar);
            this.isPeriodControl.setValue(false);
            this.startDate.setValue(date);
        } else if (date instanceof KnoraPeriod) {
            // period
            this.calendarControl.setValue(date.start.calendar);
            this.isPeriodControl.setValue(true);
            this.startDate.setValue(date.start);
            this.endDate.setValue(date.end);
        } else {
            // null
            this.calendarControl.setValue('GREGORIAN');
            this.isPeriodControl.setValue(false);
            this.startDate.setValue(null);
            this.endDate.setValue(null);
        }

        this.stateChanges.next();
    }

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

    @Input()
    get required() {
        return this._required;
    }

    set required(req) {
        this._required = coerceBooleanProperty(req);
        this.stateChanges.next();
    }

    private _required = false;

    @HostBinding('class.floating')
    get shouldLabelFloat() {
        return this.focused || !this.empty;
    }

    @HostBinding() id = `dsp-date-input-text-${DateInputTextComponent.nextId++}`;

    constructor(fb: FormBuilder,
                @Optional() @Self() public ngControl: NgControl,
                private _fm: FocusMonitor,
                private _elRef: ElementRef<HTMLElement>,
                @Optional() _parentForm: NgForm,
                @Optional() _parentFormGroup: FormGroupDirective,
                _defaultErrorStateMatcher: ErrorStateMatcher) {
        super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);

        if (this.ngControl != null) {
            // Setting the value accessor directly (instead of using
            // the providers) to avoid running into a circular import.
            this.ngControl.valueAccessor = this;
        }

        this.isPeriodControl = new FormControl(false); // TODO: if period, check if start is before end
        this.calendarControl = new FormControl(null);

        this.endDate = new FormControl(null);
        this.startDate = new FormControl(null);

        this.isPeriodControl.valueChanges.subscribe(
            isPeriod => {
                this.endDate.clearValidators();

                if (isPeriod && this.valueRequiredValidator) {
                    // end date is required in case of a period
                    this.endDate.setValidators([Validators.required]);
                }

                this.endDate.updateValueAndValidity();
            }
        );

        // TODO: find better way to detect changes
        this.startDate.valueChanges.subscribe(
            data => {
                // form's validity has not been updated yet,
                // trigger update
                this.form.updateValueAndValidity();
                this._handleInput();
            }
        );

        // TODO: find better way to detect changes
        this.endDate.valueChanges.subscribe(
            data => {
                // trigger period check validator set on start date control
                this.startDate.updateValueAndValidity();
                // form's validity has not been updated yet,
                // trigger update
                this.form.updateValueAndValidity();
                this._handleInput();
            }
        );

        // init form
        this.form = fb.group({
            isPeriod: this.isPeriodControl,
            calendar: this.calendarControl,
            startDate: this.startDate,
            endDate: this.endDate
        });

    }

    onChange = (_: any) => {
    }

    onTouched = () => {
    }

    get empty() {
        return !this.startDate && !this.endDate;
    }

    ngOnInit(): void {
        if (this.valueRequiredValidator) {
            this.startDate.setValidators([Validators.required, periodStartEndValidator(this.isPeriodControl, this.endDate)]);
        } else {
            this.startDate.setValidators([periodStartEndValidator(this.isPeriodControl, this.endDate)]);
        }
        this.startDate.updateValueAndValidity();
    }

    ngDoCheck() {
        if (this.ngControl) {
            this.updateErrorState();
        }
    }

    ngOnDestroy() {
        this.stateChanges.complete();
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

    _handleInput(): void {
        this.onChange(this.value);
    }

    onContainerClick(event: MouseEvent): void {
    }

    setDescribedByIds(ids: string[]): void {
    }

}
