import { Component, DoCheck, ElementRef, HostBinding, Input, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import {
    CanUpdateErrorState,
    CanUpdateErrorStateCtor,
    ErrorStateMatcher,
    mixinErrorState
} from '@angular/material/core';
import {
    ControlValueAccessor,
    FormBuilder,
    FormControl,
    FormGroup,
    FormGroupDirective,
    NgControl,
    NgForm,
    ValidatorFn,
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

/*function createJDNCalendarDateFromKnoraDate(date: KnoraDate): JDNConvertibleCalendar {

    let calPeriod: CalendarPeriod;
    if (date.precision === Precision.dayPrecision) {

        calPeriod = new CalendarPeriod(
            new CalendarDate(date.year, date.month, date.day),
            new CalendarDate(date.year, date.month, date.day)
        );

    } else if (date.precision === Precision.monthPrecision) {

        calPeriod = new CalendarPeriod(
            new CalendarDate(date.year, date.month, 1),
            new CalendarDate(date.year, date.month, DateInputTextComponent._calculateDaysInMonth(date.calendar, date.year, date.month))
        );

    } else if (date.precision === Precision.yearPrecision) {

        calPeriod = new CalendarPeriod(
            new CalendarDate(date.year, 1, 1),
            new CalendarDate(date.year, 12, DateInputTextComponent._calculateDaysInMonth(date.calendar, date.year, date.month))
        );

    } else {
        throw Error('Invalid precision');
    }

    console.log(calPeriod)

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

 */

/** If a period is defined, start date must be before end date */
/*
export function periodStartEndValidator(): ValidatorFn {
    return (control: FormGroup): { [key: string]: any } | null => {

        if (control.controls.isPeriod.value) {
            // period: check if start is before end

            // determine start date
            const startDate = DateInputTextComponent._createKnoraDate(control, true);
            const endDate = DateInputTextComponent._createKnoraDate(control, false);

            if (startDate.calendar === null || startDate.era === null || startDate.year === null) {
                return null;
            }

            if (endDate.calendar === null || endDate.era === null || endDate.year === null) {
                return null;
            }

            console.log(startDate, endDate);

            const jdnStartDate = createJDNCalendarDateFromKnoraDate(startDate);
            const jdnEndDate = createJDNCalendarDateFromKnoraDate(endDate);

            console.log(jdnStartDate, jdnEndDate);

            // return { period: { value: 'invalid period'} };

        }

        return null;
    };
}
*/

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

    form: FormGroup;
    stateChanges = new Subject<void>();

    isPeriodControl: FormControl;
    calendarControl: FormControl;
    startDate: FormControl;
    endDate: FormControl;

    readonly focused = false;

    readonly controlType = 'dsp-date-input-text';

    calendars = JDNConvertibleCalendar.supportedCalendars;

    @Input()
    get value(): KnoraDate | KnoraPeriod | null {

        if (!this.form.valid) {
            return null;
        }

        if (!this.isPeriodControl.value) {
            return this.startDate.value;
        } else {
            return new KnoraPeriod(this.startDate.value, this.endDate.value);
        }
    }

    set value(date: KnoraDate | KnoraPeriod | null) {

        // TODO: disable era for Islamic calendar dates?

        if (date instanceof KnoraDate) {
            this.calendarControl.setValue(date.calendar);
            this.isPeriodControl.setValue(false);
            this.startDate.setValue(date);
        } else if (date instanceof KnoraPeriod) {
            this.calendarControl.setValue(date.start.calendar);
            this.isPeriodControl.setValue(true);
            this.startDate.setValue(date.start);
            this.endDate.setValue(date.end);
        } else {
            // null
            this.calendarControl.setValue('Gregorian');
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

        this.startDate = new FormControl(null, Validators.required);
        this.endDate = new FormControl(null);

        this.isPeriodControl.valueChanges.subscribe(
            isPeriod => {
                this.endDate.clearValidators();

                if (isPeriod) {
                    this.endDate.setValidators(Validators.required);
                }

                this.endDate.updateValueAndValidity();
            }
        );

        // TODO: find better way to detect changes
        this.startDate.valueChanges.subscribe(
            data => {
                this._handleInput();
            }
        );

        // TODO: find better way to detect changes
        this.endDate.valueChanges.subscribe(
            data => {
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
