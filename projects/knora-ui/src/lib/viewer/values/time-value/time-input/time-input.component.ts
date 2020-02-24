import { Component, OnInit, HostBinding, Input, Host, Optional, Self, ElementRef } from '@angular/core';
import { ErrorStateMatcher, CanUpdateErrorStateCtor, mixinErrorState, MatFormFieldControl } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, NgControl, ControlValueAccessor, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';

/** Error when invalid control is dirty, touched, or submitted. */
export class TimeInputErrorStateMatcher implements ErrorStateMatcher {
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
  
@Component({
  selector: 'kui-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss']
})
export class TimeInputComponent extends _MatInputMixinBase implements ControlValueAccessor, MatFormFieldControl<string> {
  static nextId = 0;

  form: FormGroup;
  stateChanges = new Subject<void>();
  @HostBinding() id = `kui-time-input-${TimeInputComponent.nextId++}`; // creates unique id
  focused = false;
  errorState = false;
  controlType = `kui-time-input`;
  matcher = new TimeInputErrorStateMatcher();
  onChange = (_: any) => {}; // ??
  onTouched = () => {} // ??

  @Input() timeLabel = 'time';

  get empty() {
    const userInput = this.form.value;
    return !userInput.time;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get required() {
    return this.required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled
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
  get value(): string | null {
    const userInput = this.form.value;
    console.log('getter ', userInput);
    if (userInput.timestamp !== null) {
      return userInput.timestamp;
    }
    return null;
  }

  set value(time: string | null) {
    console.log('setter ', time);
    if (time !== null) {
      this.form.setValue(this.form.value.timestamp);
    } else {
      this.form.setValue(null);
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
      timestamp: [null, Validators.required]
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

  writeValue(timestamp: string | null): void {
    this.value = timestamp;
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
