import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListValueComponent } from './list-value.component';
import { SublistValueComponent } from './subList-value/sublist-value.component';
import {
  ReadListValue,
  MockResource,
  ListNodeV2,
  UpdateListValue,
  CreateListValue,
  ResourcePropertyDefinition,
  CreateColorValue
} from '@knora/api';
import { OnInit, Component, ViewChild, DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {KnoraApiConnectionToken} from '../../../core';
import { By } from '@angular/platform-browser';
import {of} from 'rxjs';
/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <kui-list-value #inputVal [displayValue]="displayInputVal" [mode]="mode" [propertyDef]="propertyDef"></kui-list-value>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('inputVal', {static: false}) inputValueComponent: ListValueComponent;

  displayInputVal: ReadListValue;
  propertyDef: ResourcePropertyDefinition;

  mode: 'read' | 'update' | 'create' | 'search';
  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      const inputVal: ReadListValue =
        res[0].getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasListItem', ReadListValue)[0];
      this.displayInputVal = inputVal;
      this.mode = 'read';
    });
    this.propertyDef = new ResourcePropertyDefinition();
    this.propertyDef.guiAttributes.push('hlist=<http://rdfh.ch/lists/0001/treeList>');
  }
}

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <kui-list-value #inputVal [mode]="mode" [propertyDef]="propertyDef"></kui-list-value>`
})
class TestHostCreateValueComponent implements OnInit {

  @ViewChild('inputVal', {static: false}) inputValueComponent: ListValueComponent;

  mode: 'read' | 'update' | 'create' | 'search';
  propertyDef: ResourcePropertyDefinition;

  ngOnInit() {
    this.mode = 'create';
    this.propertyDef = new ResourcePropertyDefinition();
    this.propertyDef.guiAttributes.push('hlist=<http://rdfh.ch/lists/0001/treeList>');
  }
}

describe('ListValueComponent', () => {

  beforeEach(async(() => {
    const valuesSpyObj = {
      v2: {
        values: jasmine.createSpyObj('values', ['updateValue', 'getValue', 'setValue']),
        list: jasmine.createSpyObj('list', ['getList'])
      }
    };
    TestBed.configureTestingModule({
      declarations: [
        ListValueComponent,
        SublistValueComponent,
        TestHostDisplayValueComponent,
        TestHostCreateValueComponent
      ],
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatMenuModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: KnoraApiConnectionToken,
          useValue: valuesSpyObj
        }
      ]
    })
      .compileComponents();
  }));

  describe('display and edit a list value', () => {
    let testHostComponent: TestHostDisplayValueComponent;
    let testHostFixture: ComponentFixture<TestHostDisplayValueComponent>;
    let valueComponentDe: DebugElement;
    let valueInputNativeElement;
    let commentInputDebugElement: DebugElement;
    let commentInputNativeElement;

    beforeEach(() => {
      testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
      testHostComponent = testHostFixture.componentInstance;
      testHostFixture.detectChanges();

      expect(testHostComponent).toBeTruthy();
      expect(testHostComponent.inputValueComponent).toBeTruthy();

      const hostCompDe = testHostFixture.debugElement;

      valueComponentDe = hostCompDe.query(By.directive(ListValueComponent));
      valueInputNativeElement = valueComponentDe.query(By.css('input')).nativeElement;

      commentInputDebugElement = valueComponentDe.query(By.css('input.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;

    });
    it('should display an existing value', () => {

      expect(testHostComponent.inputValueComponent.displayValue.listNode).toMatch('http://rdfh.ch/lists/0001/treeList01');
      expect(testHostComponent.inputValueComponent.displayValue.listNodeLabel).toMatch('Tree list node 01');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      expect(testHostComponent.inputValueComponent.mode).toEqual('read');

      expect(testHostComponent.inputValueComponent.form.value.listValue).toEqual('Tree list node 01');
      expect(valueInputNativeElement.readOnly).toEqual(true);

    });
    it('should make list value editable as button', () => {
      const valuesSpy = TestBed.get(KnoraApiConnectionToken);
      valuesSpy.v2.list.getList.and.callFake(
        () => {
          const res = new ListNodeV2();
          res.id = 'http://rdfh.ch/lists/0001/treeList';
          res.label = 'Listenwurzel';
          res.isRootNode = true;
          return of([res]);
        }
      );
      testHostComponent.mode = 'update';
      testHostFixture.detectChanges();
      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(valuesSpy.v2.list.getList).toHaveBeenCalledTimes(1);
      expect(valuesSpy.v2.list.getList).toHaveBeenCalledWith('http://rdfh.ch/lists/0001/treeList')
      expect(testHostComponent.inputValueComponent.listRootNode.children.length).toEqual(1);

      const openListButtonDe = valueComponentDe.query(By.css('button'));

      expect(openListButtonDe.nativeElement.textContent.trim()).toBe('Select list value' );

      expect( testHostComponent.inputValueComponent.selectedNode).toBe(undefined);

      const openListButtonEle: HTMLElement = openListButtonDe.nativeElement;
      openListButtonEle.click();
      testHostFixture.detectChanges();

      testHostComponent.inputValueComponent.menuTrigger.openMenu();
    });
    it('should validate an existing value with an added comment', () => {
      const valuesSpy = TestBed.get(KnoraApiConnectionToken);
      valuesSpy.v2.list.getList.and.callFake(
        () => {
          const res = new ListNodeV2();
          res.id = 'http://rdfh.ch/lists/0001/treeList';
          res.label = 'Listenwurzel';
          res.isRootNode = true;
          return of([res]);
        }
      );

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      commentInputNativeElement.value = 'this is a comment';

      commentInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue instanceof UpdateListValue).toBeTruthy();

      expect((updatedValue as UpdateListValue).valueHasComment).toEqual('this is a comment');

    });
  });
  describe('create a list value', () => {
    let testHostComponent: TestHostCreateValueComponent;
    let testHostFixture: ComponentFixture<TestHostCreateValueComponent>;
    let valueComponentDe: DebugElement;
    let valueInputNativeElement;
    let commentInputDebugElement: DebugElement;
    let commentInputNativeElement;
    beforeEach(() => {
      const valuesSpy = TestBed.get(KnoraApiConnectionToken);
      valuesSpy.v2.list.getList.and.callFake(
        () => {
          const res = new ListNodeV2();
          res.id = 'http://rdfh.ch/lists/0001/treeList';
          res.label = 'Listenwurzel';
          res.isRootNode = true;
          return of([res]);
        }
      );

      testHostFixture = TestBed.createComponent(TestHostCreateValueComponent);
      testHostComponent = testHostFixture.componentInstance;
      testHostComponent.mode = 'create';

      testHostFixture.detectChanges();

      expect(testHostComponent).toBeTruthy();
      expect(testHostComponent.inputValueComponent).toBeTruthy();
      expect(testHostComponent.inputValueComponent.mode).toEqual('create');
      expect(valuesSpy.v2.list.getList.calls.count()).toEqual(1);
      const hostCompDe = testHostFixture.debugElement;

      valueComponentDe = hostCompDe.query(By.directive(ListValueComponent));
      valueInputNativeElement = valueComponentDe.query(By.css('input')).nativeElement;

      commentInputDebugElement = valueComponentDe.query(By.css('input.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;

    });
    it('should create a value', () => {
      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();
      testHostComponent.inputValueComponent.valueFormControl.setValue('http://rdfh.ch/lists/0001/treeList01');
      testHostFixture.detectChanges();
      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();
      const newValue = testHostComponent.inputValueComponent.getNewValue();

      expect(newValue instanceof CreateListValue).toBeTruthy();

      expect((newValue as CreateListValue).listNode).toEqual('http://rdfh.ch/lists/0001/treeList01');
    });

    fit('should reset form after cancellation', () => {
      // simulate user input
      const newList = 'http://rdfh.ch/lists/0001/treeList01';

      testHostComponent.inputValueComponent.valueFormControl.setValue(newList);

      testHostFixture.detectChanges();

      commentInputNativeElement.value = 'created comment';

      commentInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('create');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      testHostComponent.inputValueComponent.resetFormControl();

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      expect(testHostComponent.inputValueComponent.valueFormControl.value).toEqual(null);

      expect(commentInputNativeElement.value).toEqual('');

    });
  });
});
