import {Component, ElementRef, HostBinding, Input, OnDestroy, Optional, Self} from '@angular/core';
import {MatFormFieldControl} from '@angular/material/form-field';
import {ControlValueAccessor, FormBuilder, FormGroup, NgControl} from '@angular/forms';
import {Subject} from "rxjs";
import {FocusMonitor} from "@angular/cdk/a11y";
import {coerceBooleanProperty} from "@angular/cdk/coercion";

export class Interval {

  constructor(public start: number, public end: number) {
  }
}

@Component({
  selector: 'kui-interval-input',
  templateUrl: './interval-input.component.html',
  styleUrls: ['./interval-input.component.scss'],
  providers: [{provide: MatFormFieldControl, useExisting: IntervalInputComponent}],
})
export class IntervalInputComponent implements ControlValueAccessor, MatFormFieldControl<Interval>, OnDestroy {
  static nextId = 0;

  form: FormGroup;
  stateChanges = new Subject<void>();
  @HostBinding() id = `kui-interval-input-${IntervalInputComponent.nextId++}`;
  focused = false;
  errorState = false;
  controlType = 'kui-interval-input';
  onChange = (_: any) => {};
  onTouched = () => {};

  get empty() {
    let n = this.form.value;
    return !n.area && !n.exchange && !n.subscriber;
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
  get disabled(): boolean { return this._disabled; }
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
    let n = this.form.value;
    if (n.start && n.end) {
      return new Interval(n.start, n.end);
    }
    return null;
  }

  set value(interval: Interval | null) {
    interval = interval || new Interval(0, 1);
    this.form.setValue({start: interval.start, end: interval.end});
    this.stateChanges.next();
  }

  constructor(fb: FormBuilder,
              @Optional() @Self() public ngControl: NgControl,
              private fm: FocusMonitor,
              private elRef: ElementRef<HTMLElement>) {

    this.form = fb.group({
      start: '',
      end: '',
    });

    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
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
    this.onChange(this.form.value);
  }

  //static ngAcceptInputType_disabled: boolean | string | null | undefined;
  //static ngAcceptInputType_required: boolean | string | null | undefined;

}
