import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, DoCheck, ElementRef, HostBinding, Input, OnDestroy, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgControl, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher, MatFormFieldControl, mixinErrorState, CanUpdateErrorState, CanUpdateErrorStateCtor } from '@angular/material';
import { Subject } from 'rxjs';
import { CustomRegex } from '../../custom-regex';

/**
 * Represents a DateTime consisting of a date and a time.
 */
export class ColorPicker {

  /**
   * @param color string
   */
  constructor(public color: string) {
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class TimeInputErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

class MatInputBase {
  constructor(
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl) { }
}
const _MatInputMixinBase: CanUpdateErrorStateCtor & typeof MatInputBase =
  mixinErrorState(MatInputBase);


@Component({
  selector: 'kui-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  providers: [
    { provide: MatFormFieldControl, useExisting: ColorPickerComponent }
  ]
})
export class ColorPickerComponent extends _MatInputMixinBase implements ControlValueAccessor, MatFormFieldControl<ColorPicker>, DoCheck, CanUpdateErrorState, OnDestroy {

  static nextId = 0;

  private _required = false;
  private _disabled = false;
  private _placeholder: string;

  @Input() readonly = false;

  @Input() colorLabel = 'color';

  @Input() errorStateMatcher: ErrorStateMatcher;

  @HostBinding() id = `kui-color-picker-${ColorPickerComponent.nextId++}`;

  @HostBinding('attr.aria-describedby') describedBy = '';

  form: FormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  errorState = false;
  controlType = 'kui-color-picker';
  matcher = new TimeInputErrorStateMatcher();
  colorValidator = [Validators.pattern(CustomRegex.COLOR_REGEX)];

  onChange = (_: any) => { };
  onTouched = () => { };

  get empty() {
    const colorInput = this.form.value;
    return !colorInput.color;
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

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.form.disable() : this.form.enable();
    this.stateChanges.next();
  }

  @Input()
  get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  @Input()
  get value(): ColorPicker | null {
    const colorValue = this.form.value;
    console.log('colorValue', colorValue);
    if (colorValue !== null) {
      console.log('colorValue.color 1', colorValue);
      return new ColorPicker(colorValue.color);
    }
    return null;
  }

  set value(colorValue: ColorPicker | null) {
    if (colorValue !== null) {
      this.form.setValue({ color: colorValue.color });
    } else {
      this.form.setValue({ color: null });
    }
    this.stateChanges.next();
  }

  constructor(
    fb: FormBuilder,
    @Optional() @Self() public ngControl: NgControl,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher) {

    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);

    this.form = fb.group({
      color: [null, this.colorValidator]
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
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }

  writeValue(color: ColorPicker | null): void {
    console.log('value', this.value);
    this.value = color;
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
