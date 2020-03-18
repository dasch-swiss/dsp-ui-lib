import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TimeValueComponent} from './time-value.component';
import {Component, DebugElement, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {CreateTimeValue, MockResource, ReadTimeValue, UpdateTimeValue, KnoraDate} from '@knora/api';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldControl} from '@angular/material/form-field';
import {Subject} from 'rxjs';
import {By} from '@angular/platform-browser';
import {ErrorStateMatcher} from '@angular/material';

@Component({
  selector: `kui-time-input`,
  template: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TestTimeInputComponent),
    },
    {provide: MatFormFieldControl, useExisting: TestTimeInputComponent}
  ]
})
class TestTimeInputComponent implements ControlValueAccessor, MatFormFieldControl<any> {

  @Input() readonly = false;
  @Input() value;
  @Input() disabled: boolean;
  @Input() empty: boolean;
  @Input() placeholder: string;
  @Input() required: boolean;
  @Input() shouldLabelFloat: boolean;
  @Input() errorStateMatcher: ErrorStateMatcher;

  errorState = false;
  focused = false;
  id = 'testid';
  ngControl: NgControl | null;
  onChange = (_: any) => {
  };
  stateChanges = new Subject<void>();

  writeValue(dateTime: string | null): void {
    this.value = dateTime;
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
    <kui-time-value #inputVal [displayValue]="displayInputVal" [mode]="mode"></kui-time-value>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('inputVal', {static: false}) inputValueComponent: TimeValueComponent;

  displayInputVal: ReadTimeValue;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      const inputVal: ReadTimeValue =
        res[0].getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasTimeStamp', ReadTimeValue)[0];

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
    <kui-time-value #inputVal [mode]="mode"></kui-time-value>`
})
class TestHostCreateValueComponent implements OnInit {

  @ViewChild('inputVal', {static: false}) inputValueComponent: TimeValueComponent;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    this.mode = 'create';
  }
}

describe('TimeValueComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimeValueComponent, TestHostDisplayValueComponent, TestTimeInputComponent, TestHostCreateValueComponent],
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
    })
      .compileComponents();
  }));

  describe('display and edit a time value', () => {
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

      valueComponentDe = hostCompDe.query(By.directive(TimeValueComponent));
      
    });

    it('should display an existing value', () => {

      expect(testHostComponent.inputValueComponent.displayValue.time).toEqual('2019-08-30T10:45:20.173572Z');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      expect(testHostComponent.inputValueComponent.mode).toEqual('read');

      expect(testHostComponent.inputValueComponent.timeInputComponent.readonly).toEqual(true);      

      expect(testHostComponent.inputValueComponent.timeInputComponent.value).toEqual('2019-08-30T10:45:20.173572Z');

    });

    it('should make an existing value editable', () => {
      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(testHostComponent.inputValueComponent.timeInputComponent.readonly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(testHostComponent.inputValueComponent.timeInputComponent.value).toEqual('2019-08-30T10:45:20.173572Z');

      testHostComponent.inputValueComponent.timeInputComponent.value = '2019-06-30T00:00:00Z';

      testHostComponent.inputValueComponent.timeInputComponent._handleInput();

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.valueFormControl.value).toBeTruthy();

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue instanceof UpdateTimeValue).toBeTruthy();

      expect((updatedValue as UpdateTimeValue).time).toEqual('2019-06-30T00:00:00Z');

    });

    it('should validate an existing value with an added comment', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      commentInputDebugElement = valueComponentDe.query(By.css('textarea.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(testHostComponent.inputValueComponent.timeInputComponent.value).toEqual('2019-08-30T10:45:20.173572Z');

      expect(testHostComponent.inputValueComponent.timeInputComponent.readonly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      commentInputNativeElement.value = 'this is a comment';

      commentInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue instanceof UpdateTimeValue).toBeTruthy();

      expect((updatedValue as UpdateTimeValue).valueHasComment).toEqual('this is a comment');

    });

    it('should not return an invalid update value', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(testHostComponent.inputValueComponent.timeInputComponent.readonly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      testHostComponent.inputValueComponent.timeInputComponent.value = '';
      testHostComponent.inputValueComponent.timeInputComponent._handleInput();

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue).toBeFalsy();

    });

    it('should restore the initially displayed value', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(testHostComponent.inputValueComponent.timeInputComponent.readonly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(testHostComponent.inputValueComponent.timeInputComponent.value).toEqual('2019-08-30T10:45:20.173572Z');

      testHostComponent.inputValueComponent.timeInputComponent.value = '2019-06-30T00:00:00Z';
      testHostComponent.inputValueComponent.timeInputComponent._handleInput();

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.timeInputComponent.value).toEqual('2019-06-30T00:00:00Z');

      testHostComponent.inputValueComponent.resetFormControl();

      expect(testHostComponent.inputValueComponent.timeInputComponent.value).toEqual('2019-08-30T10:45:20.173572Z');

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

    });

    it('should set a new display value', () => {

      const newTime = new ReadTimeValue();

      newTime.time = "2019-07-04T00:00:00.000Z";
      newTime.id = 'updatedId';

      testHostComponent.displayInputVal = newTime;

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.timeInputComponent.value).toEqual('2019-07-04T00:00:00.000Z');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

    });

    it('should unsubscribe when destroyed', () => {
      expect(testHostComponent.inputValueComponent.valueChangesSubscription.closed).toBeFalsy();

      testHostComponent.inputValueComponent.ngOnDestroy();

      expect(testHostComponent.inputValueComponent.valueChangesSubscription.closed).toBeTruthy();
    });
  });

  describe('create a time value', () => {
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

      valueComponentDe = hostCompDe.query(By.directive(TimeValueComponent));
      commentInputDebugElement = valueComponentDe.query(By.css('textarea.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;
    });

    it('should create a value', () => {

      expect(testHostComponent.inputValueComponent.timeInputComponent.value).toEqual(null);

      testHostComponent.inputValueComponent.timeInputComponent.value = '2019-01-01T11:00:00.000Z';
      testHostComponent.inputValueComponent.timeInputComponent._handleInput();

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('create');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      const newValue = testHostComponent.inputValueComponent.getNewValue();

      expect(newValue instanceof CreateTimeValue).toBeTruthy();

      expect((newValue as CreateTimeValue).time).toEqual('2019-01-01T11:00:00.000Z');
    });

    it('should reset form after cancellation', () => {

      testHostComponent.inputValueComponent.timeInputComponent.value = '2019-06-30T00:00:00Z';
      testHostComponent.inputValueComponent.timeInputComponent._handleInput();

      testHostFixture.detectChanges();

      commentInputNativeElement.value = 'created comment';

      commentInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('create');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      testHostComponent.inputValueComponent.resetFormControl();

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(testHostComponent.inputValueComponent.timeInputComponent.value).toEqual(null);

      expect(commentInputNativeElement.value).toEqual('');

    });
  });
});