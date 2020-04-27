import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TextValueAsStringComponent} from './text-value-as-string.component';
import {Component, DebugElement, OnInit, ViewChild} from '@angular/core';
import {CreateTextValueAsString, MockResource, ReadTextValueAsString, UpdateTextValueAsString} from '@knora/api';
import {ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <kui-text-value-as-string #inputVal [displayValue]="displayInputVal" [mode]="mode"></kui-text-value-as-string>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('inputVal') inputValueComponent: TextValueAsStringComponent;

  displayInputVal: ReadTextValueAsString;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      const inputVal: ReadTextValueAsString =
        res[0].getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasText', ReadTextValueAsString)[0];

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
    <kui-text-value-as-string #inputVal [displayValue]="displayInputVal" [mode]="mode"></kui-text-value-as-string>`
})
class TestHostDisplayValueCommentComponent implements OnInit {

  @ViewChild('inputVal') inputValueComponent: TextValueAsStringComponent;

  displayInputVal: ReadTextValueAsString;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      const inputVal: ReadTextValueAsString =
        res[0].getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasText', ReadTextValueAsString)[0];

      inputVal.valueHasComment = 'this is a comment';
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
    <kui-text-value-as-string #inputVal [mode]="mode"></kui-text-value-as-string>`
})
class TestHostCreateValueComponent implements OnInit {

  @ViewChild('inputVal') inputValueComponent: TextValueAsStringComponent;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    this.mode = 'create';

  }
}

describe('TextValueAsStringComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestHostDisplayValueComponent,
        TestHostDisplayValueCommentComponent,
        TextValueAsStringComponent,
        TestHostCreateValueComponent],
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

    let valueReadModeDebugElement: DebugElement;
    let valueReadModeNativeElement;
    
    let valueInputDebugElement: DebugElement;
    let valueInputNativeElement;

    beforeEach(() => {
      testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
      testHostComponent = testHostFixture.componentInstance;
      testHostFixture.detectChanges();

      expect(testHostComponent).toBeTruthy();
      expect(testHostComponent.inputValueComponent).toBeTruthy();

      const hostCompDe = testHostFixture.debugElement;
      valueComponentDe = hostCompDe.query(By.directive(TextValueAsStringComponent));
      
      valueReadModeDebugElement = valueComponentDe.query(By.css('.rm-value'));
      valueReadModeNativeElement = valueReadModeDebugElement.nativeElement;
    });

    it('should display an existing value', () => {

      expect(testHostComponent.inputValueComponent.displayValue.text).toEqual('test');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      expect(testHostComponent.inputValueComponent.mode).toEqual('read');

      expect(valueReadModeNativeElement.outerText).toEqual('test');

    });

    it('should make an existing value editable', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      valueInputDebugElement = valueComponentDe.query(By.css('input.value'));
      valueInputNativeElement = valueInputDebugElement.nativeElement;

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(valueInputNativeElement.readOnly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(valueInputNativeElement.value).toEqual('test');

      valueInputNativeElement.value = 'updated text';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue instanceof UpdateTextValueAsString).toBeTruthy();

      expect((updatedValue as UpdateTextValueAsString).text).toEqual('updated text');

    });

    it('should not return an invalid update value', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      valueInputDebugElement = valueComponentDe.query(By.css('input.value'));
      valueInputNativeElement = valueInputDebugElement.nativeElement;

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(valueInputNativeElement.readOnly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(valueInputNativeElement.value).toEqual('test');

      valueInputNativeElement.value = '';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue).toBeFalsy();

    });

    it('should restore the initially displayed value', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      valueInputDebugElement = valueComponentDe.query(By.css('input.value'));
      valueInputNativeElement = valueInputDebugElement.nativeElement;

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(valueInputNativeElement.readOnly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(valueInputNativeElement.value).toEqual('test');

      valueInputNativeElement.value = 'updated text';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      testHostComponent.inputValueComponent.resetFormControl();

      expect(valueInputNativeElement.value).toEqual('test');

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

    });

    it('should set a new display value', () => {

      const newStr = new ReadTextValueAsString();

      newStr.text = 'my updated text';
      newStr.id = 'updatedId';

      testHostComponent.displayInputVal = newStr;

      testHostFixture.detectChanges();

      expect(valueReadModeNativeElement.outerText).toEqual('my updated text');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

    });

  });

  describe('display and edit a text value and comment without markup', () => {

    let testHostComponent: TestHostDisplayValueCommentComponent;
    let testHostFixture: ComponentFixture<TestHostDisplayValueCommentComponent>;
    let valueComponentDe: DebugElement;

    let valueReadModeDebugElement: DebugElement;
    let valueReadModeNativeElement;

    let valueInputDebugElement: DebugElement;
    let valueInputNativeElement;

    let commentReadModeDebugElement: DebugElement;
    let commentReadModeNativeElement;

    let commentInputDebugElement: DebugElement;
    let commentInputNativeElement;

    beforeEach(() => {
      testHostFixture = TestBed.createComponent(TestHostDisplayValueCommentComponent);
      testHostComponent = testHostFixture.componentInstance;
      testHostFixture.detectChanges();

      expect(testHostComponent).toBeTruthy();
      expect(testHostComponent.inputValueComponent).toBeTruthy();

      const hostCompDe = testHostFixture.debugElement;

      valueComponentDe = hostCompDe.query(By.directive(TextValueAsStringComponent));
      valueReadModeDebugElement = valueComponentDe.query(By.css('.rm-value'));
      valueReadModeNativeElement = valueReadModeDebugElement.nativeElement;

    });

    it('should display an existing value', () => {

      expect(testHostComponent.inputValueComponent.displayValue.text).toEqual('test');

      expect(testHostComponent.inputValueComponent.displayValue.valueHasComment).toEqual('this is a comment');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      expect(valueReadModeNativeElement.outerText).toEqual('test');

    });

    it('should make an existing value editable', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      valueInputDebugElement = valueComponentDe.query(By.css('input.value'));
      valueInputNativeElement = valueInputDebugElement.nativeElement;

      commentInputDebugElement = valueComponentDe.query(By.css('textarea.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;

      expect(valueInputNativeElement.readOnly).toEqual(false);

      expect(commentInputNativeElement.readOnly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(valueInputNativeElement.value).toEqual('test');

      expect(commentInputNativeElement.value).toEqual('this is a comment');

      valueInputNativeElement.value = 'updated text';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      commentInputNativeElement.value = 'this is an updated comment';

      commentInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue instanceof UpdateTextValueAsString).toBeTruthy();

      expect((updatedValue as UpdateTextValueAsString).text).toEqual('updated text');

      expect((updatedValue as UpdateTextValueAsString).valueHasComment).toEqual('this is an updated comment');

    });

    it('should not return an invalid update value', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      valueInputDebugElement = valueComponentDe.query(By.css('input.value'));
      valueInputNativeElement = valueInputDebugElement.nativeElement;

      commentInputDebugElement = valueComponentDe.query(By.css('textarea.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;

      expect(valueInputNativeElement.readOnly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(valueInputNativeElement.value).toEqual('test');

      expect(commentInputNativeElement.value).toEqual('this is a comment');

      valueInputNativeElement.value = '';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      commentInputNativeElement.value = 'this is an updated comment';

      commentInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue).toBeFalsy();

    });

    it('should restore the initially displayed value', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      valueInputDebugElement = valueComponentDe.query(By.css('input.value'));
      valueInputNativeElement = valueInputDebugElement.nativeElement;

      commentInputDebugElement = valueComponentDe.query(By.css('textarea.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;

      expect(valueInputNativeElement.readOnly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(valueInputNativeElement.value).toEqual('test');

      valueInputNativeElement.value = 'updated text';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      commentInputNativeElement.value = 'this is an updated comment';

      commentInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      testHostComponent.inputValueComponent.resetFormControl();

      expect(valueInputNativeElement.value).toEqual('test');

      expect(commentInputNativeElement.value).toEqual('this is a comment');

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

    });

    it('should set a new display value', () => {

      const newStr = new ReadTextValueAsString();

      newStr.text = 'my updated text';
      newStr.valueHasComment = 'my updated comment';
      newStr.id = 'updatedId';

      testHostComponent.displayInputVal = newStr;

      testHostFixture.detectChanges();

      expect(valueReadModeNativeElement.outerText).toEqual('my updated text');

      expect(testHostComponent.inputValueComponent.displayValue.valueHasComment).toEqual('my updated comment');
      
      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      commentInputDebugElement = valueComponentDe.query(By.css('textarea.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;

      testHostComponent.mode = 'read';
      testHostComponent.inputValueComponent.shouldShowComment = true;

      testHostFixture.detectChanges();

      commentReadModeDebugElement = valueComponentDe.query(By.css('.rm-comment'));
      
      commentReadModeNativeElement = commentReadModeDebugElement.nativeElement;

      expect(commentReadModeNativeElement.outerText).toEqual('my updated comment');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

    });
  });

  describe('create a text value without markup', () => {

    let testHostComponent: TestHostCreateValueComponent;
    let testHostFixture: ComponentFixture<TestHostCreateValueComponent>;
    let valueComponentDe: DebugElement;
    let valueInputDebugElement: DebugElement;
    let valueInputNativeElement;
    let commentInputDebugElement: DebugElement;
    let commentInputNativeElement;

    beforeEach(() => {
      testHostFixture = TestBed.createComponent(TestHostCreateValueComponent);
      testHostComponent = testHostFixture.componentInstance;
      testHostFixture.detectChanges();

      expect(testHostComponent).toBeTruthy();
      expect(testHostComponent.inputValueComponent).toBeTruthy();

      const hostCompDe = testHostFixture.debugElement;

      valueComponentDe = hostCompDe.query(By.directive(TextValueAsStringComponent));
      valueInputDebugElement = valueComponentDe.query(By.css('input.value'));
      valueInputNativeElement = valueInputDebugElement.nativeElement;

      commentInputDebugElement = valueComponentDe.query(By.css('textarea.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;

      expect(testHostComponent.inputValueComponent.displayValue).toEqual(undefined);
      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();
      expect(valueInputNativeElement.value).toEqual('');
      expect(valueInputNativeElement.readOnly).toEqual(false);
      expect(commentInputNativeElement.value).toEqual('');
      expect(commentInputNativeElement.readOnly).toEqual(false);
    });

    it('should create a value', () => {
      valueInputNativeElement.value = 'created text';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('create');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      const newValue = testHostComponent.inputValueComponent.getNewValue();

      expect(newValue instanceof CreateTextValueAsString).toBeTruthy();

      expect((newValue as CreateTextValueAsString).text).toEqual('created text');
    });

    it('should reset form after cancellation', () => {
      valueInputNativeElement.value = 'created text';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      commentInputNativeElement.value = 'created comment';

      commentInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('create');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      testHostComponent.inputValueComponent.resetFormControl();

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(valueInputNativeElement.value).toEqual('');

      expect(commentInputNativeElement.value).toEqual('');

    });

    // *** Begin testing comments ***

    // value: yes  comment:yes
    it('should allow a comment if a value exists', () => {
      valueInputNativeElement.value = 'test';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      commentInputNativeElement.value = 'comment';

      commentInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();
    });

    // value: yes  comment:no
    it('should allow no comment if a value exists', () => {
      valueInputNativeElement.value = 'test';

      valueInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();
    });

    // value: no  comment:yes
    it('should not allow a comment if a value does not exist', () => {
      commentInputNativeElement.value = 'comment';

      commentInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();
    });

    // *** End testing comments ***
  });

});
