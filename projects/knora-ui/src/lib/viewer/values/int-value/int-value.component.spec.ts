import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntValueComponent } from './int-value.component';
import { ReadIntValue, MockResource, UpdateValue, UpdateIntValue } from '@knora/api';
import { OnInit, Component, ViewChild, DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { $ } from 'protractor';
import { By } from '@angular/platform-browser';

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <kui-int-value #inputVal [displayValue]="displayInputVal" [mode]="mode"></kui-int-value>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('inputVal', {static: false}) inputValueComponent: IntValueComponent;

  displayInputVal: ReadIntValue;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      const inputVal: ReadIntValue =
        res[0].getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger', ReadIntValue)[0];

      this.displayInputVal = inputVal;

      this.mode = 'read';
    });

  }
}

describe('IntValueComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        IntValueComponent,
        TestHostDisplayValueComponent
       ],
       imports: [
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
    })
    .compileComponents();
  }));
  
  describe('display and edit an integer value', () => {
    let testHostComponent: TestHostDisplayValueComponent;
    let testHostFixture: ComponentFixture<TestHostDisplayValueComponent>;
    let valueComponentDe: DebugElement;
    let valueInputDebugElement: DebugElement;
    let valueInputNativeElement;

    beforeEach(() => {
      testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
      testHostComponent = testHostFixture.componentInstance;
      testHostFixture.detectChanges();

      expect(testHostComponent).toBeTruthy();
      expect(testHostComponent.inputValueComponent).toBeTruthy();

      const hostCompDe = testHostFixture.debugElement;
      valueComponentDe = hostCompDe.query(By.directive(IntValueComponent));
      valueInputDebugElement = valueComponentDe.query(By.css('input.value'));
      valueInputNativeElement = valueInputDebugElement.nativeElement;
    });

    it('should display an existing value', () => {

      expect(testHostComponent.inputValueComponent.displayValue.int).toEqual(1);

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      expect(testHostComponent.inputValueComponent.mode).toEqual('read');

      expect(valueInputNativeElement.value).toEqual('1');

      expect(valueInputNativeElement.readOnly).toEqual(true);

    });

    it('should make an existing value editable', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(valueInputNativeElement.readOnly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(valueInputNativeElement.value).toEqual('1');

      valueInputNativeElement.value = '20';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue instanceof UpdateIntValue).toBeTruthy();

      expect((updatedValue as UpdateIntValue).int).toEqual(20);

    });

    it('should not return an invalid update value', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(valueInputNativeElement.readOnly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(valueInputNativeElement.value).toEqual('1');

      valueInputNativeElement.value = '1.5';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue).toBeFalsy();

    });

    it('should restore the initially displayed value', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(valueInputNativeElement.readOnly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(valueInputNativeElement.value).toEqual('1');

      valueInputNativeElement.value = '20';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      testHostComponent.inputValueComponent.resetFormControl();

      expect(valueInputNativeElement.value).toEqual('1');

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

    });

    it('should set a new display value', () => {

      const newInt = new ReadIntValue();

      newInt.int = 20;
      newInt.id = 'updatedId';

      testHostComponent.displayInputVal = newInt;

      testHostFixture.detectChanges();

      expect(valueInputNativeElement.value).toEqual('20');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

    });
  });
});
