import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule, MatInputModule } from '@angular/material';
import { BooleanValueComponent } from './boolean-value.component';
import { Component, OnInit, ViewChild, DebugElement } from '@angular/core';
import { ReadBooleanValue, MockResource, UpdateBooleanValue } from '@knora/api';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
  <kui-boolean-value #booleanVal [displayValue]="displayBooleanVal" [mode]="mode"></kui-boolean-value>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('booleanVal', {static: false}) booleanValueComponent: BooleanValueComponent;

  displayBooleanVal: ReadBooleanValue;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {
    MockResource.getTestthing().subscribe(res => {
      const booleanVal: ReadBooleanValue = 
        res[0].getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasBoolean', ReadBooleanValue)[0];

      this.displayBooleanVal = booleanVal;

      this.mode = 'read';
    });
  }
}

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
  <kui-boolean-value #booleanVal [mode]="mode"></kui-boolean-value>`
})
class TestHostCreateValueComponent implements OnInit {

  @ViewChild('booleanVal', {static: false}) booleanValueComponent: BooleanValueComponent;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {
    this.mode = 'create';
  }
}

describe('BooleanValueComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        BooleanValueComponent,
        TestHostDisplayValueComponent,
        TestHostCreateValueComponent
      ],
      imports: [
        ReactiveFormsModule,
        MatCheckboxModule,
        MatInputModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  }));

  describe('display and edit a boolean value', () => {
    let testHostComponent: TestHostDisplayValueComponent;
    let testHostFixture: ComponentFixture<TestHostDisplayValueComponent>;
    let valueComponentDe: DebugElement;
    let valueBooleanDebugElement: DebugElement;
    let valueBooleanNativeElement;
    let checkboxEl;
    let checkboxLabel;
    let commentBooleanDebugElement: DebugElement;
    let commentBooleanNativeElement;

    beforeEach(() => {
      testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
      testHostComponent = testHostFixture.componentInstance;
      testHostFixture.detectChanges();

      expect(testHostComponent).toBeTruthy();
      expect(testHostComponent.booleanValueComponent).toBeTruthy();

      const hostCompDe = testHostFixture.debugElement;
      valueComponentDe = hostCompDe.query(By.directive(BooleanValueComponent));
      valueBooleanDebugElement = valueComponentDe.query(By.css('mat-checkbox'));
      valueBooleanNativeElement = valueBooleanDebugElement.nativeElement;
      checkboxEl = valueBooleanDebugElement.query(By.css('input[type="checkbox"]')).nativeElement;
      checkboxLabel = valueBooleanDebugElement.query(By.css('span[class="mat-checkbox-label"]')).nativeElement;

      commentBooleanDebugElement = valueComponentDe.query(By.css('input.comment'));
      commentBooleanNativeElement = commentBooleanDebugElement.nativeElement;
    });

    it('should display an existing value', () => {

      expect(testHostComponent.booleanValueComponent.displayValue.bool).toEqual(true);

      expect(testHostComponent.booleanValueComponent.form.valid).toBeTruthy();

      expect(testHostComponent.booleanValueComponent.mode).toEqual('read');

      expect(checkboxEl.disabled).toBe(true);
      expect(checkboxEl.checked).toBe(true);

      expect(checkboxLabel.innerText).toEqual('true');
    });

    it('should make an existing value editable', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.booleanValueComponent.mode).toEqual('update');

      expect(checkboxEl.disabled).toBe(false);

      expect(testHostComponent.booleanValueComponent.form.valid).toBeFalsy();

      expect(checkboxEl.checked).toBe(true);

      expect(checkboxLabel.innerText).toEqual('true');

      checkboxEl.click();

      testHostFixture.detectChanges();

      expect(testHostComponent.booleanValueComponent.form.valid).toBeTruthy();

      const updatedValue = testHostComponent.booleanValueComponent.getUpdatedValue();

      expect(updatedValue instanceof UpdateBooleanValue).toBeTruthy();

      // todo: fix expect((updatedValue instanceof UpdateBooleanValue).valueOf()).toBe(false);

      expect(checkboxEl.checked).toBe(false);

      expect(checkboxEl.disabled).toBe(false);

      expect(checkboxLabel.innerText).toEqual('false');
    });

  });
});
