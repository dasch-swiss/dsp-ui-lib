import { Component, DebugElement, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockResource, ReadColorValue, UpdateColorValue, CreateColorValue } from '@knora/api';
import { ColorPickerModule } from 'ngx-color-picker';
import { Subject } from 'rxjs';
import { ColorPicker, ColorPickerComponent } from './color-picker/color-picker.component';
import { ColorValueComponent } from './color-value.component';


@Component({
  selector: `kui-color-picker`, // change selector to avoid conflict with ColorPickerComponent selector
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
    <kui-color-value #colorValue [mode]="mode"></kui-color-value>`
})
class TestHostCreateValueComponent implements OnInit {

  @ViewChild('colorValue', { static: false }) colorValueComponent: ColorValueComponent;

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
        TestColorPickerComponent,
        TestHostDisplayValueComponent,
        TestHostCreateValueComponent
      ]
    })
      .compileComponents();
  }));

  describe('display and edit a color value', () => {
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
      const newColor = { color: '54iu45po' };

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.colorValueComponent.mode).toEqual('update');

      expect(testHostComponent.colorValueComponent.colorPickerComponent.readonly).toEqual(false);

      expect(testHostComponent.colorValueComponent.form.valid).toBeFalsy();

      testHostComponent.colorValueComponent.colorPickerComponent.value = null;
      testHostComponent.colorValueComponent.colorPickerComponent._handleInput(newColor.color);

      testHostFixture.detectChanges();

      expect(testHostComponent.colorValueComponent.mode).toEqual('update');

      expect(testHostComponent.colorValueComponent.form.valid).toBeFalsy();

      const updatedValue = testHostComponent.colorValueComponent.getUpdatedValue();

      expect(updatedValue).toBeFalsy();

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

  describe('create a color value', () => {

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
      expect(testHostComponent.colorValueComponent).toBeTruthy();

      const hostCompDe = testHostFixture.debugElement;

      valueComponentDe = hostCompDe.query(By.directive(ColorValueComponent));
      commentInputDebugElement = valueComponentDe.query(By.css('input.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;
    });

    it('should create a value', () => {

      expect(testHostComponent.colorValueComponent.colorPickerComponent.value).toEqual(null);

      // simulate user input
      const newColor = {
        color: '#m5m5m5'
      };

      testHostComponent.colorValueComponent.colorPickerComponent.value = newColor;
      testHostComponent.colorValueComponent.colorPickerComponent._handleInput(newColor.color);

      testHostFixture.detectChanges();

      expect(testHostComponent.colorValueComponent.mode).toEqual('create');

      expect(testHostComponent.colorValueComponent.form.valid).toBeTruthy();

      const newValue = testHostComponent.colorValueComponent.getNewValue();

      expect(newValue instanceof CreateColorValue).toBeTruthy();

      expect((newValue as CreateColorValue).color).toEqual('#m5m5m5');

    });

    it('should reset form after cancellation', () => {
      // simulate user input
      const newColor = {
        color: '#f8f8f8'
      };

      testHostComponent.colorValueComponent.colorPickerComponent.value = newColor;
      testHostComponent.colorValueComponent.colorPickerComponent._handleInput(newColor.color);

      testHostFixture.detectChanges();

      commentInputNativeElement.value = 'created comment';

      commentInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.colorValueComponent.mode).toEqual('create');

      expect(testHostComponent.colorValueComponent.form.valid).toBeTruthy();

      testHostComponent.colorValueComponent.resetFormControl();

      expect(testHostComponent.colorValueComponent.form.valid).toBeFalsy();

      expect(testHostComponent.colorValueComponent.colorPickerComponent.value).toEqual(null);

      expect(commentInputNativeElement.value).toEqual('');

    });

  });

});
