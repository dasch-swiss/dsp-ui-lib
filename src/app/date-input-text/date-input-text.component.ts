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
import { JDNConvertibleCalendar } from 'jdnconvertiblecalendar';
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
    styleUrls: ['./date-input-text.component.scss']
})
export class DateInputTextComponent extends _MatInputMixinBase implements ControlValueAccessor, MatFormFieldControl<JDNConvertibleCalendar>, DoCheck, CanUpdateErrorState, OnInit, OnDestroy, OnInit {

    static nextId = 0;

    form: FormGroup;
    stateChanges = new Subject<void>();

    year: FormControl;
    month: FormControl;
    day: FormControl;

    readonly focused = false;

    readonly controlType = 'dsp-date-input-text';

    @Input()
    get value(): JDNConvertibleCalendar {
        // TODO: get from form
        return undefined;
    }

    set value(date: JDNConvertibleCalendar) {
        // TODO: write to form
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

        this.year = new FormControl(null, [Validators.required, Validators.min(1)]);
        this.month = new FormControl(null);
        this.day = new FormControl(null);

        /*this.year.valueChanges.subscribe(
            data => {
                // TODO: enable month selection if year is valid,
                // otherwise disable
                console.log(data);
            }
        );*/

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
        const userInput = this.form.value;
        // TODO: implement correctly
        return !userInput;

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

}
