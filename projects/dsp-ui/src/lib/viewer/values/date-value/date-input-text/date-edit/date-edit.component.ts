import {
    Component,
    DoCheck,
    ElementRef,
    HostBinding,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    Self, SimpleChanges
} from '@angular/core';
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
import { KnoraDate, KnoraPeriod } from '@dasch-swiss/dsp-js';
import { Subject } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import {
    CalendarDate,
    CalendarPeriod,
    GregorianCalendarDate,
    IslamicCalendarDate,
    JulianCalendarDate
} from 'jdnconvertiblecalendar';
import { ValueService } from '../../../../services/value.service';

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);

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
    selector: 'dsp-date-edit',
    templateUrl: './date-edit.component.html',
    styleUrls: ['./date-edit.component.scss'],
    providers: [{provide: MatFormFieldControl, useExisting: DateEditComponent}]
})
export class DateEditComponent extends _MatInputMixinBase implements ControlValueAccessor, MatFormFieldControl<KnoraDate | KnoraPeriod>, DoCheck, CanUpdateErrorState, OnDestroy, OnInit, OnChanges {

    static nextId = 0;

    @Input() calendar: string;

    @Input() valueRequiredValidator = true;

    form: FormGroup;
    stateChanges = new Subject<void>();

    eraControl: FormControl;
    yearControl: FormControl;
    monthControl: FormControl;
    dayControl: FormControl;

    months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    days = [];

    readonly focused = false;

    readonly controlType = 'dsp-date-edit';

    @Input()
    get value(): KnoraDate | null {

        if (!this.form.valid
            || this.calendar === undefined
            || this.eraControl.value === null
            || this.yearControl.value === null) { // in case valueRequiredValidator is set to false, return null for an empty year
            return null;
        }

        return new KnoraDate(
            this.calendar,
            this.eraControl.value, // TODO: handle Islamic calendar
            this.yearControl.value,
            this.monthControl.value ? this.monthControl.value : undefined,
            this.dayControl.value ? this.dayControl.value : undefined
        );
    }

    set value(date: KnoraDate | null) {
        // TODO: disable era for Islamic calendar dates?

        if (date instanceof KnoraDate) {
            this.eraControl.setValue(date.era);
            this.yearControl.setValue(date.year);
            this.monthControl.setValue(date.month ? date.month : null);
            this.dayControl.setValue(date.day ? date.day : null);

        } else {
            // null
            this.eraControl.setValue('CE');
            this.yearControl.setValue(null);
            this.monthControl.setValue(null);
            this.dayControl.setValue(null);

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

    @HostBinding() id = `dsp-date-edit-${DateEditComponent.nextId++}`;

    onChange = (_: any) => {
    }

    onTouched = () => {
    }

    get empty() {
        return !this.yearControl && !this.monthControl && !this.dayControl;
    }

    constructor(fb: FormBuilder,
                @Optional() @Self() public ngControl: NgControl,
                private _fm: FocusMonitor,
                private _elRef: ElementRef<HTMLElement>,
                @Optional() _parentForm: NgForm,
                @Optional() _parentFormGroup: FormGroupDirective,
                _defaultErrorStateMatcher: ErrorStateMatcher,
                private _valueService: ValueService) {

        super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);

        if (this.ngControl != null) {
            // Setting the value accessor directly (instead of using
            // the providers) to avoid running into a circular import.
            this.ngControl.valueAccessor = this;
        }

        this.eraControl = new FormControl(null, Validators.required);

        this.yearControl = new FormControl({
            value: null,
            disabled: false
        });

        this.monthControl = new FormControl({value: null, disabled: true});

        this.dayControl = new FormControl({value: null, disabled: true});

        // recalculate days of month when era changes
        this.eraControl.valueChanges.subscribe(
            data => {
                if (this.yearControl.valid && this.monthControl.value) {
                    this._setDays(this.calendar, this.eraControl.value, this.yearControl.value, this.monthControl.value);
                }
            }
        );

        // enable/disable month selection depending on year
        // enable/disable day selection depending on
        this.yearControl.valueChanges.subscribe(
            data => {
                if (this.yearControl.valid) {
                    this.monthControl.enable();
                } else {
                    this.monthControl.disable();
                }

                if (this.yearControl.valid && this.monthControl.value) {
                    this.dayControl.enable();
                } else {
                    this.dayControl.disable();
                }
            }
        );

        // enable/disable day selection depending on month
        // recalculate days when month changes
        this.monthControl.valueChanges.subscribe(
            data => {
                if (this.yearControl.valid && this.monthControl.value) {
                    this._setDays(this.calendar, this.eraControl.value, this.yearControl.value, this.monthControl.value);
                }

                if (this.monthControl.value) {
                    this.dayControl.enable();
                } else {
                    this.dayControl.setValue(null);
                    this.dayControl.disable();
                }
            }
        );

        // init form
        this.form = fb.group({
            era: this.eraControl,
            year: this.yearControl,
            month: this.monthControl,
            day: this.dayControl
        });

    }

    ngOnInit() {
        if (this.valueRequiredValidator) {
            this.yearControl.setValidators([Validators.required, Validators.min(1)]);
            this.yearControl.updateValueAndValidity();
        }
    }

    ngOnChanges(changes: SimpleChanges) {

        // async to prevent changed after checked error
        resolvedPromise.then(
            () => {
                // reinit days on calendar change
                this._setDays(this.calendar, this.eraControl.value, this.yearControl.value, this.monthControl.value);
                this._handleInput();
            }
        );

    }

    ngDoCheck() {
        if (this.ngControl) {
            this.updateErrorState();
        }
    }

    ngOnDestroy() {
        this.stateChanges.complete();
    }

    writeValue(date: KnoraDate | null): void {
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
     *
     * Sets available days for a given year and month.
     *
     * @param calendar calendar of the given date.
     * @param era era of the given date.
     * @param year year of the given date.
     * @param month month of the given date.
     * @param daysArr array representing available days of a given month.
     */
    private _setDays(calendar: string, era: string, year: number, month: number) {

        // TODO: exclude Islamic calendar date?
        let yearAstro: number = year;
        if (era === 'BCE') {
            // convert historical date to astronomical date
            yearAstro = (yearAstro * -1) + 1;
        }

        const days = this._valueService.calculateDaysInMonth(calendar, yearAstro, month);

        // empty array
        this.days = [];
        for (let i = 1; i <= days; i++) {
            this.days.push(i);
        }

        // check if selected day is still valid, otherwise set to latest possible day
        if (this.dayControl.value !== null && this.dayControl.value > this.days.length) {
            this.dayControl.setValue(this.days.length);
        }
    }

}
