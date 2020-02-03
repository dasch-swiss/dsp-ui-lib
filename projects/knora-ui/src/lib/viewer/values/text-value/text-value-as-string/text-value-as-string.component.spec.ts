import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TextValueAsStringComponent} from './text-value-as-string.component';
import {Component, DebugElement, OnInit, ViewChild} from '@angular/core';
import {MockResource, ReadTextValueAsString, UpdateTextValueAsString, UpdateValue} from '@knora/api';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';

/**
 * Test host component to simulate parent component.
 */
@Component({
  selector: `lib-host-component`,
  template: `
    <lib-text-value-as-string #strVal [displayValue]="displayStrVal" [mode]="mode"></lib-text-value-as-string>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('strVal', {static: false}) stringValueComponent: TextValueAsStringComponent;

  displayStrVal: ReadTextValueAsString;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      const strVal: ReadTextValueAsString =
        res[0].getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasText', ReadTextValueAsString)[0];

      this.displayStrVal = strVal;

      this.mode = 'read';
    });

  }
}

describe('TextValueAsStringComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostDisplayValueComponent, TextValueAsStringComponent],
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: []
    })
      .compileComponents();
  }));

  describe('display and edit a text value without markup', () => {

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
      expect(testHostComponent.stringValueComponent).toBeTruthy();

      const hostCompDe = testHostFixture.debugElement;
      valueComponentDe = hostCompDe.query(By.directive(TextValueAsStringComponent));
      valueInputDebugElement = valueComponentDe.query(By.css('input.value'));
      valueInputNativeElement = valueInputDebugElement.nativeElement;
    });

    it('should display an existing value', () => {

      expect(testHostComponent.stringValueComponent.displayValue.text).toEqual('test');

      expect(testHostComponent.stringValueComponent.form.valid).toBeTruthy();

      expect(valueInputNativeElement.value).toEqual('test');

      expect(valueInputNativeElement.readOnly).toEqual(true);

    });

    it('should make an existing value editable', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(valueInputNativeElement.readOnly).toEqual(false);

      expect(testHostComponent.stringValueComponent.form.valid).toBeFalsy();

      expect(valueInputNativeElement.value).toEqual('test');

      valueInputNativeElement.value = 'updated text';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.stringValueComponent.form.valid).toBeTruthy();

      const updatedValue = testHostComponent.stringValueComponent.getUpdatedValue();

      expect(updatedValue instanceof UpdateTextValueAsString).toBeTruthy();

      expect((updatedValue as UpdateTextValueAsString).text).toEqual('updated text');

    });

    it('should not return an invalid update value', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(valueInputNativeElement.readOnly).toEqual(false);

      expect(testHostComponent.stringValueComponent.form.valid).toBeFalsy();

      expect(valueInputNativeElement.value).toEqual('test');

      valueInputNativeElement.value = '';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.stringValueComponent.form.valid).toBeFalsy();

      const updatedValue = testHostComponent.stringValueComponent.getUpdatedValue();

      expect(updatedValue).toBeFalsy();

    });

    it('should restore the initially displayed value', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(valueInputNativeElement.readOnly).toEqual(false);

      expect(testHostComponent.stringValueComponent.form.valid).toBeFalsy();

      expect(valueInputNativeElement.value).toEqual('test');

      valueInputNativeElement.value = 'updated text';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      testHostComponent.stringValueComponent.resetFormControl();

      expect(valueInputNativeElement.value).toEqual('test');

      expect(testHostComponent.stringValueComponent.form.valid).toBeFalsy();

    });

    it('should set a new display value', () => {

      const newStr = new ReadTextValueAsString();

      newStr.text = 'my updated text';
      newStr.id = 'updatedId';

      testHostComponent.displayStrVal = newStr;

      testHostFixture.detectChanges();

      expect(valueInputNativeElement.value).toEqual('my updated text');

      expect(testHostComponent.stringValueComponent.form.valid).toBeTruthy();

    });

  });

});
