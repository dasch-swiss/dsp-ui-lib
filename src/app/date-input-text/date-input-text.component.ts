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
    NgForm, Validators
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import {
    CalendarDate,
    CalendarPeriod,
    GregorianCalendarDate, IslamicCalendarDate,
    JDNConvertibleCalendar,
    JulianCalendarDate
} from 'jdnconvertiblecalendar';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { KnoraDate, KnoraPeriod } from '@dasch-swiss/dsp-js';

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
    providers: [{ provide: MatFormFieldControl, useExisting: DateInputTextComponent }]
})
export class DateInputTextComponent extends _MatInputMixinBase implements ControlValueAccessor, MatFormFieldControl<KnoraDate | KnoraPeriod>, DoCheck, CanUpdateErrorState, OnInit, OnDestroy, OnInit {

    static nextId = 0;

    form: FormGroup;
    stateChanges = new Subject<void>();

    isPeriodControl: FormControl;
    calendarControl: FormControl;
    eraControl: FormControl;
    startYearControl: FormControl;
    startMonthControl: FormControl;
    startDayControl: FormControl;

    months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    days = [];

    readonly focused = false;

    readonly controlType = 'dsp-date-input-text';

    calendars = JDNConvertibleCalendar.supportedCalendars;

    @Input()
    get value(): KnoraDate | KnoraPeriod {

        // TODO: handle precision, era, and period
        return new KnoraDate(this.calendarControl.value, this.eraControl.value, this.startYearControl.value, this.startMonthControl.value, this.startDayControl.value);
    }

    set value(date: KnoraDate | KnoraPeriod | null) {

        // TODO: disable era for Islamic calendar dates?

        if (date instanceof KnoraDate) {

            // TODO: handle precision, era, and period
            this.calendarControl.setValue(date.calendar);
            this.eraControl.setValue(date.era);
            this.startYearControl.setValue(date.year);
            this.startMonthControl.setValue(date.month);
            this.startDayControl.setValue(date.day);

        } else if (date instanceof KnoraPeriod) {

            // TODO: handle precision, era, and period
            this.calendarControl.setValue(date.start.calendar);
            this.eraControl.setValue(date.start.era);
            this.startYearControl.setValue(date.start.year);
            this.startMonthControl.setValue(date.start.month);
            this.startDayControl.setValue(date.start.day);
        } else {
            // null

            this.calendarControl.setValue('Gregorian');
            this.eraControl.setValue('CE');
            this.startYearControl.setValue(null);
            this.startMonthControl.setValue(null);
            this.startDayControl.setValue(null);
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

        this.isPeriodControl = new FormControl(false);
        this.calendarControl = new FormControl(null);
        this.eraControl = new FormControl(true);
        this.startYearControl = new FormControl({ value: null, disabled: false }, [Validators.required, Validators.min(1)]);
        this.startMonthControl = new FormControl({ value: null, disabled: true });
        this.startDayControl = new FormControl({ value: null, disabled: true });

        // recalculate days of month when era changes
        this.eraControl.valueChanges.subscribe(
            data => {
                if (this.startYearControl.valid && this.startMonthControl.value) {
                    this._setDays();
                }
            }
        );

        // TODO: disable era for Islamic calendar dates?
        // recalculate days of month when calendar changes
        this.calendarControl.valueChanges.subscribe(
            data => {
                if (this.startYearControl.valid && this.startMonthControl.value) {
                    this._setDays();
                }
            }
        );

        // single date, start date

        // enable/disable month selection depending on year
        // enable/disable day selection depending on
        this.startYearControl.valueChanges.subscribe(
            data => {
                this._yearChanged(this.startYearControl, this.startMonthControl, this.startDayControl);
            }
        );

        // enable/disable day selection depending on month
        // recalculate days when month changes
        this.startMonthControl.valueChanges.subscribe(
            data => {
               this._monthChanged(this.startYearControl, this.startMonthControl, this.startDayControl);
            }
        );

        // init form
        this.form = fb.group({
            isPeriod: this.isPeriodControl,
            calendar: this.calendarControl,
            era: this.eraControl,
            startYear: this.startYearControl,
            startMonth: this.startMonthControl,
            startDay: this.startDayControl
        });
    }

    onChange = (_: any) => {
    }

    onTouched = () => {
    }

    get empty() {
        return !this.startYearControl && !this.startMonthControl && !this.startDayControl;
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

    /**
     * Reacts to changes of the year and sets month and day controls accordingly.
     *
     * @param year year control.
     * @param month month control.
     * @param day day control.
     */
    private _yearChanged(year: FormControl, month: FormControl, day: FormControl) {
        if (year.valid) {
            month.enable();
        } else {
            month.disable();
        }

        if (year.valid && month.value) {
            day.enable();
        } else {
            day.disable();
        }
    }

    /**
     * Reacts to changes of the month and sets the day controls accordingly.
     *
     * @param year year control.
     * @param month month control.
     * @param day day control.
     */
    private _monthChanged(year: FormControl, month: FormControl, day: FormControl) {
        if (year.valid && month.value) {
            this._setDays();
        }

        if (month.value) {
            day.enable();
        } else {
            day.setValue(null);
            day.disable();
        }
    }

    /**
     * Calculates the number of days in a month for a given date.
     *
     * @param calendar the date's calendar.
     * @param year the date's year.
     * @param month the date's month.
     */
    private _calculateDaysInMonth(calendar: string, year: number, month: number): number {
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

    private _setDays() {

        // check for era
        let year = this.startYearControl.value;

        // TODO: exclude Islamic calendar date?
        if (this.eraControl.value === 'BCE') {
            // convert historical date to astronomical date
            year = (year * -1) + 1;
        }

        const days = this._calculateDaysInMonth(this.calendarControl.value, year, this.startMonthControl.value);
        this.days = [];
        for (let i = 1; i <= days; i++) {
            this.days.push(i);
        }
    }

}
