
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListValueComponent } from './list-value.component';
import { SublistValueComponent } from './subList-value/sublist-value.component';
import { ReadListValue, MockResource, UpdateValue, UpdateListValue, CreateListValue, ReadResource } from '@knora/api';
import { OnInit, Component, ViewChild, DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { MatMenuModule} from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {KnoraApiConnectionToken} from '../../../core';
import { By } from '@angular/platform-browser';

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
        values: jasmine.createSpyObj('values', ['updateValue', 'getValue'])
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
  });
});
