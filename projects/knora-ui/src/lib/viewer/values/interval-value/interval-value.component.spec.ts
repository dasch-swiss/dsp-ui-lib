import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IntervalValueComponent} from './interval-value.component';
import {Component, DebugElement, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {CreateIntervalValue, MockResource, ReadIntervalValue, UpdateIntervalValue} from '@knora/api';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {Interval} from './interval-input/interval-input.component';
import {MatFormFieldControl} from '@angular/material/form-field';
import {Subject} from 'rxjs';
import {By} from '@angular/platform-browser';

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

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <kui-interval-value #inputVal [mode]="mode"></kui-interval-value>`
})
class TestHostCreateValueComponent implements OnInit {

  @ViewChild('inputVal', {static: false}) inputValueComponent: IntervalValueComponent;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    this.mode = 'create';
  }
}


describe('IntervalValueComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IntervalValueComponent, TestHostDisplayValueComponent, TestIntervalInputComponent, TestHostCreateValueComponent],
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
    })
      .compileComponents();
  }));

  describe('display and edit an interval value', () => {
    let testHostComponent: TestHostDisplayValueComponent;
    let testHostFixture: ComponentFixture<TestHostDisplayValueComponent>;

    let valueComponentDe: DebugElement;
    let commentInputDebugElement: DebugElement;
    let commentInputNativeElement;

    beforeEach(() => {
      testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
      testHostComponent = testHostFixture.componentInstance;
      testHostFixture.detectChanges();

      expect(testHostComponent).toBeTruthy();
      expect(testHostComponent.inputValueComponent).toBeTruthy();

      const hostCompDe = testHostFixture.debugElement;

      valueComponentDe = hostCompDe.query(By.directive(IntervalValueComponent));
      commentInputDebugElement = valueComponentDe.query(By.css('input.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;
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

    it('should validate an existing value with an added comment', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(testHostComponent.inputValueComponent.displayValue.start).toEqual(0);

      expect(testHostComponent.inputValueComponent.displayValue.end).toEqual(216000);

      expect(testHostComponent.inputValueComponent.intervalInputComponent.readonly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      commentInputNativeElement.value = 'this is a comment';

      commentInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue instanceof UpdateIntervalValue).toBeTruthy();

      expect((updatedValue as UpdateIntervalValue).valueHasComment).toEqual('this is a comment');

    });

    it('should not return an invalid update value', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(testHostComponent.inputValueComponent.intervalInputComponent.readonly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      testHostComponent.inputValueComponent.intervalInputComponent.value = null;
      testHostComponent.inputValueComponent.intervalInputComponent._handleInput();

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue).toBeFalsy();

    });

    it('should restore the initially displayed value', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(testHostComponent.inputValueComponent.intervalInputComponent.readonly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      // simulate user input
      const newInterval = {
        start: 100,
        end: 200
      };

      testHostComponent.inputValueComponent.intervalInputComponent.value = newInterval;
      testHostComponent.inputValueComponent.intervalInputComponent._handleInput();

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.valueFormControl.value.start).toEqual(100);

      expect(testHostComponent.inputValueComponent.valueFormControl.value.end).toEqual(200);

      testHostComponent.inputValueComponent.resetFormControl();

      expect(testHostComponent.inputValueComponent.intervalInputComponent.value.start).toEqual(0);

      expect(testHostComponent.inputValueComponent.intervalInputComponent.value.end).toEqual(216000);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

    });

    it('should set a new display value', () => {

      const newInterval = new ReadIntervalValue();

      newInterval.start = 300;
      newInterval.end = 500;
      newInterval.id = 'updatedId';

      testHostComponent.displayInputVal = newInterval;

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.intervalInputComponent.value.start).toEqual(300);

      expect(testHostComponent.inputValueComponent.intervalInputComponent.value.end).toEqual(500);

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

    });

    it('should unsubscribe when destroyed', () => {
      expect(testHostComponent.inputValueComponent.valueChangesSubscription.closed).toBeFalsy();

      testHostComponent.inputValueComponent.ngOnDestroy();

      expect(testHostComponent.inputValueComponent.valueChangesSubscription.closed).toBeTruthy();
    });

  });

  describe('create an interval value', () => {

    let testHostComponent: TestHostCreateValueComponent;
    let testHostFixture: ComponentFixture<TestHostCreateValueComponent>;

    let valueComponentDe: DebugElement;
    let commentInputDebugElement: DebugElement;
    let commentInputNativeElement;

    beforeEach(() => {
      testHostFixture = TestBed.createComponent(TestHostCreateValueComponent);
      testHostComponent = testHostFixture.componentInstance;
      testHostFixture.detectChanges();

      expect(testHostComponent).toBeTruthy();
      expect(testHostComponent.inputValueComponent).toBeTruthy();

      const hostCompDe = testHostFixture.debugElement;

      valueComponentDe = hostCompDe.query(By.directive(IntervalValueComponent));
      commentInputDebugElement = valueComponentDe.query(By.css('input.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;
    });

    it('should create a value', () => {

      expect(testHostComponent.inputValueComponent.intervalInputComponent.value).toEqual(null);

      // simulate user input
      const newInterval = {
        start: 100,
        end: 200
      };

      testHostComponent.inputValueComponent.intervalInputComponent.value = newInterval;
      testHostComponent.inputValueComponent.intervalInputComponent._handleInput();

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('create');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      const newValue = testHostComponent.inputValueComponent.getNewValue();

      expect(newValue instanceof CreateIntervalValue).toBeTruthy();

      expect((newValue as CreateIntervalValue).start).toEqual(100);
      expect((newValue as CreateIntervalValue).end).toEqual(200);
    });

    it('should reset form after cancellation', () => {
      // simulate user input
      const newInterval = {
        start: 100,
        end: 200
      };

      testHostComponent.inputValueComponent.intervalInputComponent.value = newInterval;
      testHostComponent.inputValueComponent.intervalInputComponent._handleInput();

      testHostFixture.detectChanges();

      commentInputNativeElement.value = 'created comment';

      commentInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('create');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      testHostComponent.inputValueComponent.resetFormControl();

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(testHostComponent.inputValueComponent.intervalInputComponent.value).toEqual(null);

      expect(commentInputNativeElement.value).toEqual('');

    });

  });
});
