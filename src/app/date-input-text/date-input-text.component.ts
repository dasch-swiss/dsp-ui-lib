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

    calendar: FormControl;
    era: FormControl;
    year: FormControl;
    month: FormControl;
    day: FormControl;

    months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    days = [];

    readonly focused = false;

    readonly controlType = 'dsp-date-input-text';

    calendars = JDNConvertibleCalendar.supportedCalendars;

    @Input()
    get value(): KnoraDate | KnoraPeriod {

        // TODO: handle precision, era, and period
        return new KnoraDate(this.calendar.value, this.era.value, this.year.value, this.month.value, this.day.value);
    }

    set value(date: KnoraDate | KnoraPeriod | null) {

        if (date instanceof KnoraDate) {

            // TODO: handle precision, era, and period
            this.calendar.setValue(date.calendar);
            this.era.setValue(date.era);
            this.year.setValue(date.year);
            this.month.setValue(date.month);
            this.day.setValue(date.day);

        } else if (date instanceof KnoraPeriod) {

            // TODO: handle precision, era, and period
            this.calendar.setValue(date.start.calendar);
            this.era.setValue(date.start.era);
            this.year.setValue(date.start.year);
            this.month.setValue(date.start.month);
            this.day.setValue(date.start.day);
        } else {
            // null

            this.calendar.setValue('Gregorian');
            this.era.setValue('CE');
            this.year.setValue(null);
            this.month.setValue(null);
            this.day.setValue(null);
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

        this.calendar = new FormControl(null);
        this.era = new FormControl(true);
        this.year = new FormControl({ value: null, disabled: false }, [Validators.required, Validators.min(1)]);
        this.month = new FormControl({ value: null, disabled: true });
        this.day = new FormControl({ value: null, disabled: true });

        // recalculate days of month when era changes
        this.era.valueChanges.subscribe(
            data => {
                if (this.year.valid && this.month.value) {
                    this._setDays();
                }
            }
        );

        // recalculate days of month when calendar changes
        this.calendar.valueChanges.subscribe(
            data => {
                if (this.year.valid && this.month.value) {
                    this._setDays();
                }
            }
        );

        // single date, start date

        // enable/disable month selection depending on year
        // enable/disable day selection depending on
        this.year.valueChanges.subscribe(
            data => {
                this._yearChanged(this.year, this.month, this.day);
            }
        );

        // enable/disable day selection depending on month
        // recalculate days when month changes
        this.month.valueChanges.subscribe(
            data => {
                if (this.year.valid && this.month.value) {
                    this._setDays();
                }

                if (this.month.value) {
                    this.day.enable();
                } else {
                    this.day.setValue(null);
                    this.day.disable();
                }
            }
        );

        // init form
        this.form = fb.group({
            calendar: this.calendar,
            era: this.era,
            year: this.year,
            month: this.month,
            day: this.day
        });
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

    onChange = (_: any) => {
    }

    onTouched = () => {
    }

    get empty() {
        return !this.year && !this.month && !this.day;
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
        let year = this.year.value;
        if (this.era.value === 'BCE') {
            // convert historical date to astronomical date
            year = (year * -1) + 1;
        }

        console.log('setting days', this.calendar.value, year);

        const days = this._calculateDaysInMonth(this.calendar.value, year, this.month.value);
        this.days = [];
        for (let i = 1; i <= days; i++) {
            this.days.push(i);
        }
    }

}
