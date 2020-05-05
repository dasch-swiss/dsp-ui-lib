import {Component, DoCheck, ElementRef, HostBinding, Input, OnDestroy, Optional, Self} from '@angular/core';
import {MatFormFieldControl} from '@angular/material/form-field';
import {ControlValueAccessor, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgControl, NgForm, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {FocusMonitor} from '@angular/cdk/a11y';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {CanUpdateErrorState, CanUpdateErrorStateCtor, ErrorStateMatcher, mixinErrorState} from '@angular/material/core';

/**
 * Represents an interval consisting.
 */
export class Interval {

  /**
   * @param start interval's start.
   * @param end interval's end.
   */
  constructor(public start: number, public end: number) {
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class IntervalInputErrorStateMatcher implements ErrorStateMatcher {
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

// https://material.angular.io/guide/creating-a-custom-form-field-control
@Component({
  selector: 'kui-interval-input',
  templateUrl: './interval-input.component.html',
  styleUrls: ['./interval-input.component.scss'],
  providers: [{provide: MatFormFieldControl, useExisting: IntervalInputComponent}]
})
export class IntervalInputComponent extends _MatInputMixinBase implements ControlValueAccessor, MatFormFieldControl<Interval>, DoCheck, CanUpdateErrorState, OnDestroy {
  static nextId = 0;

  form: FormGroup;
  stateChanges = new Subject<void>();
  @HostBinding() id = `kui-interval-input-${IntervalInputComponent.nextId++}`;
  focused = false;
  errorState = false;
  controlType = 'kui-interval-input';
  matcher = new IntervalInputErrorStateMatcher();
  onChange = (_: any) => {};
  onTouched = () => {};

  @Input() intervalStartLabel = 'start';
  @Input() intervalEndLabel = 'end';

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

  @HostBinding('attr.aria-describedby') describedBy = '';

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  @Input()
  get value(): Interval | null {
    const userInput = this.form.value;
    if (userInput.start !== null && userInput.end !== null) {
      return new Interval(userInput.start, userInput.end);
    }
    return null;
  }

  set value(interval: Interval | null) {
    if (interval !== null) {
      this.form.setValue({start: interval.start, end: interval.end});
    } else {
      this.form.setValue({start: null, end: null});
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
      start: [null, Validators.required],
      end: [null, Validators.required]
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

  writeValue(interval: Interval | null): void {
    this.value = interval;
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
