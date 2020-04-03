import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DateValueComponent} from './date-value.component';
import {Component, DebugElement, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {CreateDateValue, KnoraDate, KnoraPeriod, MockResource, ReadDateValue, UpdateDateValue} from '@knora/api';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldControl} from '@angular/material/form-field';
import {Subject} from 'rxjs';
import {ErrorStateMatcher} from '@angular/material/core';
import {By} from '@angular/platform-browser';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@Component({
  selector: `kui-date-input`,
  template: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TestDateInputComponent),
    },
    {provide: MatFormFieldControl, useExisting: TestDateInputComponent}
  ]
})
class TestDateInputComponent implements ControlValueAccessor, MatFormFieldControl<any> {

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

  writeValue(date: KnoraDate | KnoraPeriod | null): void {
    this.value = date;
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
    <kui-date-value #inputVal [displayValue]="displayInputVal" [mode]="mode"></kui-date-value>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('inputVal', {static: false}) inputValueComponent: DateValueComponent;

  displayInputVal: ReadDateValue;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      const inputVal: ReadDateValue =
        res[0].getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate', ReadDateValue)[0];

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
    <kui-date-value #inputVal [mode]="mode"></kui-date-value>`
})
class TestHostCreateValueComponent implements OnInit {

  @ViewChild('inputVal', {static: false}) inputValueComponent: DateValueComponent;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    this.mode = 'create';

  }
}

describe('DateValueComponent', () => {
  let component: DateValueComponent;
  let fixture: ComponentFixture<DateValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      declarations: [
        DateValueComponent,
        TestDateInputComponent,
        TestHostDisplayValueComponent,
        TestHostCreateValueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('display and edit a date value', () => {
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

      valueComponentDe = hostCompDe.query(By.directive(DateValueComponent));
      commentInputDebugElement = valueComponentDe.query(By.css('input.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;
    });

    it('should display an existing value', () => {

      expect(testHostComponent.inputValueComponent.displayValue.date).toEqual(new KnoraDate('GREGORIAN', 'CE', 2018, 5, 13));

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      expect(testHostComponent.inputValueComponent.mode).toEqual('read');

      expect(testHostComponent.inputValueComponent.dateInputComponent.readonly).toEqual(true);

      expect(testHostComponent.inputValueComponent.dateInputComponent.value).toEqual(new KnoraDate('GREGORIAN', 'CE', 2018, 5, 13));

    });

    it('should make an existing value editable', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(testHostComponent.inputValueComponent.dateInputComponent.readonly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(testHostComponent.inputValueComponent.dateInputComponent.value).toEqual(new KnoraDate('GREGORIAN', 'CE', 2018, 5, 13));

      // simulate user input
      const newKnoraDate = new KnoraDate('GREGORIAN', 'CE', 2019, 5, 13);

      testHostComponent.inputValueComponent.dateInputComponent.value = newKnoraDate;
      testHostComponent.inputValueComponent.dateInputComponent._handleInput();

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.valueFormControl.value).toBeTruthy();

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue instanceof UpdateDateValue).toBeTruthy();

      expect((updatedValue as UpdateDateValue).calendar).toEqual('GREGORIAN');
      expect((updatedValue as UpdateDateValue).startYear).toEqual(2019);
      expect((updatedValue as UpdateDateValue).endYear).toEqual(2019);
      expect((updatedValue as UpdateDateValue).startMonth).toEqual(5);
      expect((updatedValue as UpdateDateValue).endMonth).toEqual(5);
      expect((updatedValue as UpdateDateValue).startDay).toEqual(13);
      expect((updatedValue as UpdateDateValue).endDay).toEqual(13);

    });

    it('should validate an existing value with an added comment', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(testHostComponent.inputValueComponent.displayValue.date).toEqual(new KnoraDate('GREGORIAN', 'CE', 2018, 5, 13));

      expect(testHostComponent.inputValueComponent.dateInputComponent.readonly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      commentInputNativeElement.value = 'this is a comment';

      commentInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue instanceof UpdateDateValue).toBeTruthy();

      expect((updatedValue as UpdateDateValue).valueHasComment).toEqual('this is a comment');

    });

    it('should not return an invalid update value', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(testHostComponent.inputValueComponent.dateInputComponent.readonly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      testHostComponent.inputValueComponent.dateInputComponent.value = null;
      testHostComponent.inputValueComponent.dateInputComponent._handleInput();

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue).toBeFalsy();

    });

    it('should restore the initially displayed value', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(testHostComponent.inputValueComponent.dateInputComponent.readonly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      // simulate user input
      const newKnoraDate = new KnoraDate('GREGORIAN', 'CE', 2019, 5, 13);

      testHostComponent.inputValueComponent.dateInputComponent.value = newKnoraDate;
      testHostComponent.inputValueComponent.dateInputComponent._handleInput();

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.valueFormControl.value).toEqual(new KnoraDate('GREGORIAN', 'CE', 2019, 5, 13));

      expect(testHostComponent.inputValueComponent.dateInputComponent.value).toEqual(new KnoraDate('GREGORIAN', 'CE', 2019, 5, 13));

      testHostComponent.inputValueComponent.resetFormControl();

      expect(testHostComponent.inputValueComponent.valueFormControl.value).toEqual(new KnoraDate('GREGORIAN', 'CE', 2018, 5, 13));

      expect(testHostComponent.inputValueComponent.dateInputComponent.value).toEqual(new KnoraDate('GREGORIAN', 'CE', 2018, 5, 13));

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

    });

    it('should set a new display value', done => {

      MockResource.getTestthing().subscribe(res => {
        const newDate: ReadDateValue =
          res[0].getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate', ReadDateValue)[0];

        newDate.id = 'updatedId';

        newDate.date = new KnoraDate('GREGORIAN', 'CE', 2019, 5, 13);

        testHostComponent.displayInputVal = newDate;

        testHostFixture.detectChanges();

        expect(testHostComponent.inputValueComponent.valueFormControl.value).toEqual(new KnoraDate('GREGORIAN', 'CE', 2019, 5, 13));

        expect(testHostComponent.inputValueComponent.dateInputComponent.value).toEqual(new KnoraDate('GREGORIAN', 'CE', 2019, 5, 13));

        expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

        done();
      });

    });

    it('should unsubscribe when destroyed', () => {
      expect(testHostComponent.inputValueComponent.valueChangesSubscription.closed).toBeFalsy();

      testHostComponent.inputValueComponent.ngOnDestroy();

      expect(testHostComponent.inputValueComponent.valueChangesSubscription.closed).toBeTruthy();

    });

    it('should compare two dates', () => {

      expect(testHostComponent.inputValueComponent.sameDate(
        new KnoraDate('GREGORIAN', 'CE', 2018, 5, 13),
        new KnoraDate('GREGORIAN', 'CE', 2018, 5, 13))).toEqual(true);

      expect(testHostComponent.inputValueComponent.sameDate(
        new KnoraDate('JULIAN', 'CE', 2018, 5, 13),
        new KnoraDate('GREGORIAN', 'CE', 2018, 5, 13))).toEqual(false);

      expect(testHostComponent.inputValueComponent.sameDate(
        new KnoraDate('GREGORIAN', 'CE', 2018, 5, 13),
        new KnoraDate('GREGORIAN', 'CE', 2019, 5, 13))).toEqual(false);

    });

    it('should correctly populate an UpdateValue from a KnoraDate', () => {

      const date = new KnoraDate('GREGORIAN', 'CE', 2018, 5, 13);

      const updateVal = new UpdateDateValue();

      testHostComponent.inputValueComponent.populateValue(updateVal, date);

      expect(updateVal.calendar).toEqual('GREGORIAN');
      expect(updateVal.startEra).toEqual('CE');
      expect(updateVal.startDay).toEqual(13);
      expect(updateVal.startMonth).toEqual(5);
      expect(updateVal.startYear).toEqual(2018);
      expect(updateVal.endEra).toEqual('CE');
      expect(updateVal.endDay).toEqual(13);
      expect(updateVal.endMonth).toEqual(5);
      expect(updateVal.endYear).toEqual(2018);

    });

    it('should correctly populate an UpdateValue from a KnoraPeriod', () => {

      const dateStart = new KnoraDate('GREGORIAN', 'CE', 2018, 5, 13);
      const dateEnd = new KnoraDate('GREGORIAN', 'CE', 2019, 6, 14);

      const updateVal = new UpdateDateValue();

      testHostComponent.inputValueComponent.populateValue(updateVal, new KnoraPeriod(dateStart, dateEnd));

      expect(updateVal.calendar).toEqual('GREGORIAN');
      expect(updateVal.startEra).toEqual('CE');
      expect(updateVal.startDay).toEqual(13);
      expect(updateVal.startMonth).toEqual(5);
      expect(updateVal.startYear).toEqual(2018);
      expect(updateVal.endEra).toEqual('CE');
      expect(updateVal.endDay).toEqual(14);
      expect(updateVal.endMonth).toEqual(6);
      expect(updateVal.endYear).toEqual(2019);

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

      valueComponentDe = hostCompDe.query(By.directive(DateValueComponent));
      commentInputDebugElement = valueComponentDe.query(By.css('input.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;
    });

    it('should create a value', () => {

      expect(testHostComponent.inputValueComponent.dateInputComponent.value).toEqual(null);

      // simulate user input
      const newKnoraDate = new KnoraDate('JULIAN', 'CE', 2019, 5, 13);

      testHostComponent.inputValueComponent.dateInputComponent.value = newKnoraDate;
      testHostComponent.inputValueComponent.dateInputComponent._handleInput();

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('create');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      const newValue = testHostComponent.inputValueComponent.getNewValue();

      expect(newValue instanceof CreateDateValue).toBeTruthy();

      expect((newValue as CreateDateValue).calendar).toEqual('JULIAN');

      expect((newValue as CreateDateValue).startDay).toEqual(13);
      expect((newValue as CreateDateValue).endDay).toEqual(13);
      expect((newValue as CreateDateValue).startMonth).toEqual(5);
      expect((newValue as CreateDateValue).endMonth).toEqual(5);
      expect((newValue as CreateDateValue).startYear).toEqual(2019);
      expect((newValue as CreateDateValue).endYear).toEqual(2019);

    });

    it('should reset form after cancellation', () => {

      // simulate user input
      const newKnoraDate = new KnoraDate('JULIAN', 'CE', 2019, 5, 13);

      testHostComponent.inputValueComponent.dateInputComponent.value = newKnoraDate;
      testHostComponent.inputValueComponent.dateInputComponent._handleInput();

      testHostFixture.detectChanges();

      commentInputNativeElement.value = 'created comment';

      commentInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('create');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      testHostComponent.inputValueComponent.resetFormControl();

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(testHostComponent.inputValueComponent.dateInputComponent.value).toEqual(null);

      expect(commentInputNativeElement.value).toEqual('');

    });

  });


});
