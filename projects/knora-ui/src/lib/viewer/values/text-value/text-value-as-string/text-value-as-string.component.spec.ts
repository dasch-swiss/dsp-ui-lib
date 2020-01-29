import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TextValueAsStringComponent} from './text-value-as-string.component';
import {Component, DebugElement, OnInit, ViewChild} from '@angular/core';
import {MockResource, ReadTextValueAsString} from '@knora/api';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule, MatInputModule} from '@angular/material';
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

  @ViewChild('strVal', {static: false}) stringValue: TextValueAsStringComponent;

  displayStrVal: ReadTextValueAsString;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    const testthing = MockResource.getTestthing();

    testthing.subscribe(res => {
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
      ]
    })
      .compileComponents();
  }));

  describe('display and edit a text value without markup', () => {

    let testHostComponent: TestHostDisplayValueComponent;
    let testHostFixture: ComponentFixture<TestHostDisplayValueComponent>;

    beforeEach(() => {
      testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
      testHostComponent = testHostFixture.componentInstance;
      testHostFixture.detectChanges();

      expect(testHostComponent).toBeTruthy();
    });

    it('should display an existing value', () => {
      expect(testHostComponent.stringValue).toBeTruthy();

      expect(testHostComponent.displayStrVal.text).toEqual('test');

      expect(testHostComponent.stringValue.form.valid).toBeTruthy();

      const hostCompDe = testHostFixture.debugElement;

      const integerVal = hostCompDe.query(By.directive(TextValueAsStringComponent));

      const inputDebugElement: DebugElement = integerVal.query(By.css('input'));

      const inputNativeElement = inputDebugElement.nativeElement;

      expect(inputNativeElement.readOnly).toEqual(true);

      expect(inputNativeElement.value).toEqual('test');

    });

    it('reinit the display value', () => {

      const newStr = new ReadTextValueAsString();
      newStr.text = 'ahahahaha';

      testHostComponent.displayStrVal = newStr;

      testHostFixture.detectChanges();

      const hostCompDe = testHostFixture.debugElement;

      const integerVal = hostCompDe.query(By.directive(TextValueAsStringComponent));

      const inputDebugElement: DebugElement = integerVal.query(By.css('input'));

      const inputNativeElement = inputDebugElement.nativeElement;

      expect(inputNativeElement.readOnly).toEqual(true);

      expect(inputNativeElement.value).toEqual('ahahahaha');

    });

  });

});
