import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IntervalValueComponent} from './interval-value.component';
import {Component, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {MockResource, ReadIntervalValue, UpdateIntervalValue} from '@knora/api';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {Interval} from './interval-input/interval-input.component';
import {MatFormFieldControl} from '@angular/material/form-field';
import {Subject} from 'rxjs';

@Component({
  selector: `kui-interval-input`,
  template: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TestIntervalInputComponent),
    },
    {provide: MatFormFieldControl, useExisting: TestIntervalInputComponent}
  ]
})
class TestIntervalInputComponent implements ControlValueAccessor, MatFormFieldControl<any> {

  @Input() readonly = false;
  @Input() value;
  @Input() disabled: boolean;
  @Input() empty: boolean;
  @Input() placeholder: string;
  @Input() required: boolean;
  @Input() shouldLabelFloat: boolean;

  errorState = false;
  focused = false;
  id = 'testid';
  ngControl: NgControl | null;
  onChange = (_: any) => {
  };
  stateChanges = new Subject<void>();

  writeValue(interval: Interval | null): void {
    this.value = interval;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  onContainerClick(event: MouseEvent): void {
  }

  setDescribedByIds(ids: string[]): void {
  }

  _handleInput(): void {
    this.onChange(this.value);
  }

}

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <kui-interval-value #inputVal [displayValue]="displayInputVal" [mode]="mode"></kui-interval-value>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('inputVal', {static: false}) inputValueComponent: IntervalValueComponent;

  displayInputVal: ReadIntervalValue;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      const inputVal: ReadIntervalValue =
        res[0].getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInterval', ReadIntervalValue)[0];

      this.displayInputVal = inputVal;

      this.mode = 'read';
    });

  }
}


describe('IntervalValueComponent', () => {
  let testHostComponent: TestHostDisplayValueComponent;
  let testHostFixture: ComponentFixture<TestHostDisplayValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IntervalValueComponent, TestHostDisplayValueComponent, TestIntervalInputComponent],
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
    })
      .compileComponents();
  }));

  describe('display and edit an interval value', () => {

    beforeEach(() => {
      testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
      testHostComponent = testHostFixture.componentInstance;
      testHostFixture.detectChanges();

      expect(testHostComponent).toBeTruthy();
      expect(testHostComponent.inputValueComponent).toBeTruthy();
    });

    it('should display an existing value', () => {

      expect(testHostComponent.inputValueComponent.displayValue.start).toEqual(0);

      expect(testHostComponent.inputValueComponent.displayValue.end).toEqual(216000);

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      expect(testHostComponent.inputValueComponent.mode).toEqual('read');

      expect(testHostComponent.inputValueComponent.intervalInputComponent.readonly).toEqual(true);

      expect(testHostComponent.inputValueComponent.intervalInputComponent.value.start).toEqual(0);

      expect(testHostComponent.inputValueComponent.intervalInputComponent.value.end).toEqual(216000);

    });

    it('should make an existing value editable', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(testHostComponent.inputValueComponent.intervalInputComponent.readonly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(testHostComponent.inputValueComponent.intervalInputComponent.value.start).toEqual(0);

      expect(testHostComponent.inputValueComponent.intervalInputComponent.value.end).toEqual(216000);

      // simulate user input
      const newInterval = {
        start: 100,
        end: 200
      };

      testHostComponent.inputValueComponent.intervalInputComponent.value = newInterval;
      testHostComponent.inputValueComponent.intervalInputComponent._handleInput();

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.valueFormControl.value).toBeTruthy();

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue instanceof UpdateIntervalValue).toBeTruthy();

      expect((updatedValue as UpdateIntervalValue).start).toEqual(100);
      expect((updatedValue as UpdateIntervalValue).end).toEqual(200);

    });

  });
});
