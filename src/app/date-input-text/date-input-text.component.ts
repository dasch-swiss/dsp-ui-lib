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
export class DateInputTextComponent extends _MatInputMixinBase implements ControlValueAccessor, MatFormFieldControl<JDNConvertibleCalendar>, DoCheck, CanUpdateErrorState, OnInit, OnDestroy, OnInit {

    static nextId = 0;

    form: FormGroup;
    stateChanges = new Subject<void>();

    year: FormControl;
    month: FormControl;
    day: FormControl;

    months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    days = [];

    readonly focused = false;

    readonly controlType = 'dsp-date-input-text';

    calendar = 'Gregorian';

    @Input()
    get value(): JDNConvertibleCalendar {

        // TODO: handle precision
        const date = new CalendarDate(this.year.value, this.month.value, this.day.value);

        if (this.calendar === 'Gregorian') {
            return new GregorianCalendarDate(new CalendarPeriod(date, date));
        } else if (this.calendar === 'Julian') {
            return new JulianCalendarDate(new CalendarPeriod(date, date));
        } else if (this.calendar === 'Islamic') {
            return new IslamicCalendarDate(new CalendarPeriod(date, date));
        } else {
            throw Error('Unknown calendar ' + this.calendar);
        }

    }

    set value(date: JDNConvertibleCalendar) {
        this.calendar = date.calendarName;

        // TODO: handle precision
        this.year.setValue(date.toCalendarPeriod().periodStart.year);
        this.month.setValue(date.toCalendarPeriod().periodStart.month)
        this.day.setValue(date.toCalendarPeriod().periodStart.day);

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

        this.year = new FormControl({ value: null, disabled: false }, [Validators.required, Validators.min(1)]);
        this.month = new FormControl({ value: null, disabled: true });
        this.day = new FormControl({ value: null, disabled: true });

        this.year.valueChanges.subscribe(
            data => {
                if (this.year.valid) {
                    this.month.enable();
                } else {
                    this.month.disable();
                }

                if (this.year.valid && this.month.value) {
                    this.day.enable();
                } else {
                    this.day.disable();
                }
            }
        );

        this.month.valueChanges.subscribe(
            data => {
                if (this.year.valid && this.month.value) {
                    const days = this._calculateDaysInMonth(this.calendar, this.year.value, this.month.value);
                    this.days = [];
                    for (let i = 1; i <= days; i++) {
                        this.days.push(i);
                    }
                }

                if (this.month.value) {
                    this.day.enable();
                } else {
                    this.day.setValue(null);
                    this.day.disable();
                }
            }
        );

        this.form = fb.group({
            year: this.year,
            month: this.month,
            day: this.day
        });
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

    writeValue(date: JDNConvertibleCalendar | null): void {
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

}
