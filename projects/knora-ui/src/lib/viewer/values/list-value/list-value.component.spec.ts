
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListValueComponent } from './list-value.component';
import { SublistValueComponent } from './subList-value/sublist-value.component';
import { ReadListValue, MockResource, ListNodeV2, UpdateValue, UpdateListValue, CreateListValue, ReadResource } from '@knora/api';
import { OnInit, Component, ViewChild, DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import {MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {KnoraApiConnectionToken} from '../../../core';
import { $ } from 'protractor';
import { By } from '@angular/platform-browser';
import {of} from 'rxjs';
/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <kui-list-value #inputVal [displayValue]="displayInputVal" [mode]="mode"></kui-list-value>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('inputVal', {static: false}) inputValueComponent: ListValueComponent;

  displayInputVal: ReadListValue;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      const inputVal: ReadListValue =
        res[0].getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasListItem', ReadListValue)[0];
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
    <kui-list-value #inputVal [mode]="mode"></kui-list-value>`
})
class TestHostCreateValueComponent implements OnInit {

  @ViewChild('inputVal', {static: false}) inputValueComponent: ListValueComponent;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    this.mode = 'create';

  }
}

describe('ListValueComponent', () => {

  beforeEach(async(() => {
    const valuesSpyObj = {
      v2: {
        values: jasmine.createSpyObj('values', ['updateValue', 'getValue', 'setValue']),
        list: jasmine.createSpyObj('list', ['getNode', 'getList'])
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
    it('should make a list value editable', () => {
      const valuesSpy = TestBed.get(KnoraApiConnectionToken);
      valuesSpy.v2.list.getNode.and.callFake(
        () => {
          const res = new ListNodeV2();
          res.id = 'http://rdfh.ch/lists/0001/treeList01';
          res.isRootNode = false;
          res.hasRootNode = 'http://rdfh.ch/lists/0001/treeList';
          return of([res]);
        }
      );
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
      expect(testHostComponent.inputValueComponent.form.value.listValue).toEqual('');
      expect(valuesSpy.v2.list.getList).toHaveBeenCalledTimes(1);
      expect(valuesSpy.v2.list.getNode).toHaveBeenCalledTimes(1);
      expect(valuesSpy.v2.list.getNode).toHaveBeenCalledWith('http://rdfh.ch/lists/0001/treeList01');
      // expect(valuesSpy.v2.list.getList).toHaveBeenCalledWith('http://rdfh.ch/lists/0001/treeList');
    });
    it('should validate an existing value with an added comment', () => {
      const valuesSpy = TestBed.get(KnoraApiConnectionToken);
      valuesSpy.v2.list.getNode.and.callFake(
        () => {
          const res = new ListNodeV2();
          res.id = 'http://rdfh.ch/lists/0001/treeList01';
          res.isRootNode = false;
          res.hasRootNode = 'http://rdfh.ch/lists/0001/treeList';
          return of([res]);
        }
      );
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

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      commentInputNativeElement.value = 'this is a comment';

      commentInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue instanceof UpdateListValue).toBeTruthy();

      expect((updatedValue as UpdateListValue).valueHasComment).toEqual('this is a comment');

    });
    // it('should get the selected list node', () => {
    //   const testList = new ListNodeV2();
    //   testList.id = 'http://rdfh.ch/lists/0001/treeList/01';
    //   testList.label = 'tree list slash';
    //
    //   let menuTrigger: MatMenuTrigger;
    //   testHostComponent.inputValueComponent.getSelectedNode(testList);
    //
    //   const expectedListNode = 'http://rdfh.ch/lists/0001/treeList/01';
    //   testHostFixture.detectChanges();
    //   expect(testHostComponent.inputValueComponent.displayValue.id).toEqual(expectedListNode);
    //
    // });
  });
});
