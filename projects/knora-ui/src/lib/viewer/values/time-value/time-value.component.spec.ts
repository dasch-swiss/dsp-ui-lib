import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TimeValueComponent} from './time-value.component';
import {Component, DebugElement, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {CreateTimeValue, MockResource, ReadTimeValue, UpdateTimeValue, KnoraDate} from '@knora/api';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {DateTime} from './time-input/time-input.component';
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

  writeValue(dateTime: DateTime | null): void {
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
      commentInputDebugElement = valueComponentDe.query(By.css('input.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;
    });

    it('should display an existing value', () => {

      expect(testHostComponent.inputValueComponent.displayValue.time).toEqual("2019-08-30T10:45:20.173572Z");

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      expect(testHostComponent.inputValueComponent.mode).toEqual('read');

      expect(testHostComponent.inputValueComponent.timeInputComponent.readonly).toEqual(true);      

      expect(testHostComponent.inputValueComponent.timeInputComponent.value.date.year).toEqual(2019);

      expect(testHostComponent.inputValueComponent.timeInputComponent.value.date.month).toEqual(8);

      expect(testHostComponent.inputValueComponent.timeInputComponent.value.date.day).toEqual(30);
      
      expect(testHostComponent.inputValueComponent.timeInputComponent.value.time).toEqual("10:45");

    });
  });
});