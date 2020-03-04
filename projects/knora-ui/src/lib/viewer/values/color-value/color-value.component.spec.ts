import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorValueComponent } from './color-value.component';
import { MatFormFieldModule, MatFormFieldControl } from '@angular/material/form-field';
import { ColorPickerComponent, ColorPicker } from './color-picker/color-picker.component';
import { ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ColorPickerModule } from 'ngx-color-picker';
import { Component, forwardRef, Input, ViewChild, OnInit, DebugElement } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import { Subject } from 'rxjs';
import { ReadColorValue, MockResource, UpdateColorValue } from '@knora/api';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: `kui-test-color-picker`,
  template: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TestColorPickerComponent),
    },
    { provide: MatFormFieldControl, useExisting: TestColorPickerComponent }
  ]
})
class TestColorPickerComponent implements ControlValueAccessor, MatFormFieldControl<any> {

  @Input() readonly = false;
  @Input() value;
  @Input() disabled: boolean;
  @Input() empty: boolean;
  @Input() placeholder: string;
  @Input() required: boolean;
  @Input() shouldLabelFloat: boolean;
  @Input() errorStateMatcher: ErrorStateMatcher;

  stateChanges = new Subject<void>();
  errorState = false;
  focused = false;
  id = 'testid';
  ngControl: NgControl | null;
  onChange = (_: any) => {
  }

  writeValue(colorValue: ColorPicker | null): void {
    this.value = colorValue;
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
    <kui-color-value #colorVal [displayValue]="displayColorVal" [mode]="mode"></kui-color-value>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('colorVal', { static: false }) colorValueComponent: ColorValueComponent;

  displayColorVal: ReadColorValue;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      const colorVal: ReadColorValue =
        res[0].getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasColor', ReadColorValue)[0];

      this.displayColorVal = colorVal;

      this.mode = 'read';
    });

  }
}

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <kui-color-value #colorVal [mode]="mode"></kui-color-value>`
})
class TestHostCreateValueComponent implements OnInit {

  @ViewChild('colorVal', { static: false }) colorValueComponent: ColorValueComponent;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    this.mode = 'create';
  }
}

describe('ColorValueComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        ColorPickerModule,
        BrowserAnimationsModule
      ],
      declarations: [
        ColorValueComponent,
        ColorPickerComponent,
        TestColorPickerComponent,
        TestHostDisplayValueComponent,
        TestHostCreateValueComponent
      ]
    })
      .compileComponents();
  }));

  describe('display and edit an color value', () => {
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
      expect(testHostComponent.colorValueComponent).toBeTruthy();

      const hostCompDe = testHostFixture.debugElement;

      valueComponentDe = hostCompDe.query(By.directive(ColorValueComponent));
      commentInputDebugElement = valueComponentDe.query(By.css('input.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;
    });

    it('should display an existing value', () => {

      expect(testHostComponent.colorValueComponent.displayValue.color).toEqual('#ff3333');

      expect(testHostComponent.colorValueComponent.form.valid).toBeTruthy();

      expect(testHostComponent.colorValueComponent.mode).toEqual('read');

      expect(testHostComponent.colorValueComponent.colorPickerComponent.readonly).toEqual(true);

      expect(testHostComponent.colorValueComponent.colorPickerComponent.value.color).toEqual('#ff3333');

    });

    it('should make an existing value editable', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.colorValueComponent.mode).toEqual('update');

      expect(testHostComponent.colorValueComponent.colorPickerComponent.readonly).toEqual(false);

      expect(testHostComponent.colorValueComponent.form.valid).toBeFalsy();

      expect(testHostComponent.colorValueComponent.colorPickerComponent.value.color).toEqual('#ff3333');

      // simulate user input
      const newColor = {
        color: '#b1b1b1'
      };

      testHostComponent.colorValueComponent.colorPickerComponent.value = newColor;
      testHostComponent.colorValueComponent.colorPickerComponent._handleInput(newColor.color);

      testHostFixture.detectChanges();

      expect(testHostComponent.colorValueComponent.valueFormControl.value).toBeTruthy();

      expect(testHostComponent.colorValueComponent.form.valid).toBeTruthy();

      const updatedValue = testHostComponent.colorValueComponent.getUpdatedValue();

      expect(updatedValue instanceof UpdateColorValue).toBeTruthy();

      expect((updatedValue as UpdateColorValue).color).toEqual('#b1b1b1');

    });

    it('should validate an existing value with an added comment', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.colorValueComponent.mode).toEqual('update');

      expect(testHostComponent.colorValueComponent.displayValue.color).toEqual('#ff3333');

      expect(testHostComponent.colorValueComponent.colorPickerComponent.readonly).toEqual(false);

      expect(testHostComponent.colorValueComponent.form.valid).toBeFalsy();

      commentInputNativeElement.value = 'this is a comment';

      commentInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.colorValueComponent.form.valid).toBeTruthy();

      const updatedValue = testHostComponent.colorValueComponent.getUpdatedValue();

      expect(updatedValue instanceof UpdateColorValue).toBeTruthy();

      expect((updatedValue as UpdateColorValue).valueHasComment).toEqual('this is a comment');

    });

    it('should not return an invalid update value', () => {

      // simulate user input
      const newColor = { color: '!34hu5609jfng' };

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.colorValueComponent.mode).toEqual('update');

      expect(testHostComponent.colorValueComponent.colorPickerComponent.readonly).toEqual(false);

      expect(testHostComponent.colorValueComponent.form.valid).toBeFalsy();

      testHostComponent.colorValueComponent.colorPickerComponent.value = null;
      testHostComponent.colorValueComponent.colorPickerComponent._handleInput(newColor.color);

      testHostFixture.detectChanges();

      expect(testHostComponent.colorValueComponent.mode).toEqual('update');

      /* expect(testHostComponent.colorValueComponent.form.valid).toBeFalsy();

      const updatedValue = testHostComponent.colorValueComponent.getUpdatedValue();

      expect(updatedValue).toBeFalsy(); */

    });

    it('should restore the initially displayed value', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.colorValueComponent.mode).toEqual('update');

      expect(testHostComponent.colorValueComponent.colorPickerComponent.readonly).toEqual(false);

      expect(testHostComponent.colorValueComponent.form.valid).toBeFalsy();

      // simulate user input
      const newColor = {
        color: '#g7g7g7'
      };

      testHostComponent.colorValueComponent.colorPickerComponent.value = newColor;
      testHostComponent.colorValueComponent.colorPickerComponent._handleInput(newColor.color);

      testHostFixture.detectChanges();

      expect(testHostComponent.colorValueComponent.valueFormControl.value.color).toEqual('#g7g7g7');

      testHostComponent.colorValueComponent.resetFormControl();

      expect(testHostComponent.colorValueComponent.colorPickerComponent.value.color).toEqual('#ff3333');

      expect(testHostComponent.colorValueComponent.form.valid).toBeFalsy();

    });

    it('should set a new display value', () => {

      const newColor = new ReadColorValue();

      newColor.color = '#d8d8d8';
      newColor.id = 'updatedId';

      testHostComponent.displayColorVal = newColor;

      testHostFixture.detectChanges();

      expect(testHostComponent.colorValueComponent.colorPickerComponent.value.color).toEqual('#d8d8d8');

      expect(testHostComponent.colorValueComponent.form.valid).toBeTruthy();

    });

    it('should unsubscribe when destroyed', () => {
      expect(testHostComponent.colorValueComponent.valueChangesSubscription.closed).toBeFalsy();

      testHostComponent.colorValueComponent.ngOnDestroy();

      expect(testHostComponent.colorValueComponent.valueChangesSubscription.closed).toBeTruthy();
    });

  });

});
