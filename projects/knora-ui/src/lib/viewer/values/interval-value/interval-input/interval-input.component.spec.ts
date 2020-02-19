import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {Interval, IntervalInputComponent} from './interval-input.component';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Component, DebugElement, OnInit, ViewChild} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <div [formGroup]="form">
      <mat-form-field>
        <kui-interval-input #intervalInput [formControlName]="'interval'" [readonly]="readonly"></kui-interval-input>
      </mat-form-field>
    </div>`
})
class TestHostComponent implements OnInit {

  @ViewChild('intervalInput', {static: false}) intervalInputComponent: IntervalInputComponent;

  form: FormGroup;

  readonly = false;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      interval: [new Interval(1, 2)]
    });

  }
}

describe('InvertalInputComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;

  let intervalInputComponentDe: DebugElement;
  let startInputDebugElement: DebugElement;
  let startInputNativeElement;
  let endInputDebugElement: DebugElement;
  let endInputNativeElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatFormFieldModule, BrowserAnimationsModule],
      declarations: [IntervalInputComponent, TestHostComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();

    expect(testHostComponent).toBeTruthy();
    expect(testHostComponent.intervalInputComponent).toBeTruthy();
    expect(testHostComponent.intervalInputComponent.readonly).toBeFalsy();

    const hostCompDe = testHostFixture.debugElement;
    intervalInputComponentDe = hostCompDe.query(By.directive(IntervalInputComponent));
    startInputDebugElement = intervalInputComponentDe.query(By.css('input.start'));
    startInputNativeElement = startInputDebugElement.nativeElement;
    endInputDebugElement = intervalInputComponentDe.query(By.css('input.end'));
    endInputNativeElement = endInputDebugElement.nativeElement;

    expect(startInputNativeElement.readOnly).toBe(false);
    expect(endInputNativeElement.readOnly).toBe(false);
  });

  it('should initialize the interval correctly', () => {

    expect(startInputNativeElement.value).toEqual('1');
    expect(endInputNativeElement.value).toEqual('2');

  });

  it('should propagate changes made by the user', () => {

    startInputNativeElement.value = '3';
    startInputNativeElement.dispatchEvent(new Event('input'));

    testHostFixture.detectChanges();

    expect(testHostComponent.form.controls.interval).toBeTruthy();
    expect(testHostComponent.form.controls.interval.value.start).toEqual(3);
    expect(testHostComponent.form.controls.interval.value.end).toEqual(2);

    endInputNativeElement.value = '35';
    endInputNativeElement.dispatchEvent(new Event('input'));

    testHostFixture.detectChanges();

    expect(testHostComponent.form.controls.interval.value).toBeTruthy();
    expect(testHostComponent.form.controls.interval.value.start).toEqual(3);
    expect(testHostComponent.form.controls.interval.value.end).toEqual(35);

  });

  it('should return "null" for an empty (invalid) user input', () => {

    startInputNativeElement.value = '';
    startInputNativeElement.dispatchEvent(new Event('input'));

    endInputNativeElement.value = '';
    endInputNativeElement.dispatchEvent(new Event('input'));

    testHostFixture.detectChanges();

    expect(testHostComponent.form.controls.interval.value).toBe(null);
  });

  it('should initialize the interval with an empty value', () => {

    testHostComponent.form.controls.interval.setValue(null);
    expect(startInputNativeElement.value).toEqual('0');
    expect(endInputNativeElement.value).toEqual('0');

  });

  it('should be readonly when the readonly input is set to true', () => {
    testHostComponent.readonly = true;

    testHostFixture.detectChanges();

    expect(startInputNativeElement.readOnly).toBe(true);
    expect(endInputNativeElement.readOnly).toBe(true);
  });
});
