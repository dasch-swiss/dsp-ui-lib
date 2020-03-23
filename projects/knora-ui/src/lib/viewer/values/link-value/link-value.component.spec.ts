import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkValueComponent } from './link-value.component';
import {
  ReadLinkValue,
  MockResource,
  UpdateLinkValue,
  CreateLinkValue,
  ReadResource
} from '@knora/api';
import { OnInit, Component, ViewChild, DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {KnoraApiConnectionToken} from '../../../core';
import { By } from '@angular/platform-browser';
import {of} from 'rxjs';

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <kui-link-value #inputVal [displayValue]="displayInputVal" [mode]="mode" [parentResource]="parentResource" [propType]="propType"></kui-link-value>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('inputVal', {static: false}) inputValueComponent: LinkValueComponent;

  displayInputVal: ReadLinkValue;
  parentResource: ReadResource;
  propType: string;
  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      const inputVal: ReadLinkValue =
        res[0].getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThingValue', ReadLinkValue)[0];

      this.displayInputVal = inputVal;
      this.propType = this.displayInputVal.property;
      this.parentResource = res[0];
      this.mode = 'read';
    });

  }
}

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <kui-link-value #inputVal [mode]="mode" [parentResource]="parentResource" [propType]="propType"></kui-link-value>`
})
class TestHostCreateValueComponent implements OnInit {

  @ViewChild('inputVal', {static: false}) inputValueComponent: LinkValueComponent;
  parentResource: ReadResource;
  propType: string;
  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      this.propType = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThingValue';
      this.parentResource = res[0];
      this.mode = 'create';
    });
  }
}

describe('LinkValueComponent', () => {

  beforeEach(async(() => {
    const valuesSpyObj = {
      v2: {
        values: jasmine.createSpyObj('values', ['updateValue', 'getValue']),
        search: jasmine.createSpyObj('search', ['doSearchByLabel']),
      }
    };
    TestBed.configureTestingModule({
      declarations: [
        LinkValueComponent,
        TestHostDisplayValueComponent,
        TestHostCreateValueComponent
       ],
       imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatAutocompleteModule,
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

  describe('display and edit a link value', () => {
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

      valueComponentDe = hostCompDe.query(By.directive(LinkValueComponent));
      valueInputNativeElement = valueComponentDe.query(By.css('input')).nativeElement;

      commentInputDebugElement = valueComponentDe.query(By.css('input.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;

    });

    it('should display an existing value', () => {

      expect(testHostComponent.displayInputVal.linkedResourceIri).toMatch('http://rdfh.ch/0001/0C-0L1kORryKzJAJxxRyRQ');
      expect(testHostComponent.displayInputVal.propertyLabel).toMatch('Another thing');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      expect(testHostComponent.inputValueComponent.mode).toEqual('read');

      expect(testHostComponent.displayInputVal.linkedResource.label).toEqual('Sierra');
      expect(testHostComponent.displayInputVal.linkedResource.type).toEqual('http://0.0.0.0:3333/ontology/0001/anything/v2#Thing');
      expect(valueInputNativeElement.readOnly).toEqual(true);

    });
    it('should make a link value editable', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();
      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(valueInputNativeElement.readOnly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

    });
    it('should search for resources by their label', () => {
      const valuesSpy = TestBed.get(KnoraApiConnectionToken);
      valuesSpy.v2.search.doSearchByLabel.and.callFake(
        () => {
          const res = new ReadResource();
          res.id = 'http://rdfh.ch/0001/IwMDbs0KQsaxSRUTl2cAIQ';
          res.label = 'hidden thing';
          return of([res]);
        }
      );

      testHostComponent.inputValueComponent.searchByLabel('thing');

      testHostFixture.detectChanges();
      expect(valuesSpy.v2.search.doSearchByLabel).toHaveBeenCalledWith('thing', 0, { limitToResourceClass: 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing'});
      expect(testHostComponent.inputValueComponent.resources.length).toEqual(1);

      expect(testHostComponent.inputValueComponent.resources[0].id).toEqual('http://rdfh.ch/0001/IwMDbs0KQsaxSRUTl2cAIQ');
    });

    it('should validate an existing value with an added comment', () => {

      testHostComponent.mode = 'update';

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.mode).toEqual('update');

      expect(valueInputNativeElement.readOnly).toEqual(false);

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      commentInputNativeElement.value = 'this is a comment';

      commentInputNativeElement.dispatchEvent(new Event('input'));

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      const updatedValue = testHostComponent.inputValueComponent.getUpdatedValue();

      expect(updatedValue instanceof UpdateLinkValue).toBeTruthy();

      expect((updatedValue as UpdateLinkValue).valueHasComment).toEqual('this is a comment');

    });
    it('should return a selected resource', () => {

      const res = new ReadResource();
      res.id = 'http://rdfh.ch/0001/a-blue-thing';
      testHostComponent.inputValueComponent.valueFormControl.setValue(res);

      testHostFixture.detectChanges();

      expect(testHostComponent.inputValueComponent.form.value.linkValue.id).toEqual('http://rdfh.ch/0001/a-blue-thing');
    });

  });

  describe('create a new link value', () => {
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
      expect(testHostComponent.inputValueComponent).toBeTruthy();

      const hostCompDe = testHostFixture.debugElement;

      valueComponentDe = hostCompDe.query(By.directive(LinkValueComponent));
      commentInputDebugElement = valueComponentDe.query(By.css('input.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;
    });

    it('should create a value', () => {
      const valuesSpy = TestBed.get(KnoraApiConnectionToken);

      valuesSpy.v2.search.doSearchByLabel.and.callFake(
        () => {
          const res = new ReadResource();
          res.id = 'http://rdfh.ch/0001/IwMDbs0KQsaxSRUTl2cAIQ';
          res.label = 'hidden thing';
          return of([res]);
        }
      );

      // expect(testHostComponent.inputValueComponent.valueFormControl).toEqual(null);
      expect(testHostComponent.inputValueComponent.mode).toEqual('create');

      testHostComponent.inputValueComponent.searchByLabel('thing');

      testHostFixture.detectChanges();

      expect(valuesSpy.v2.search.doSearchByLabel).toHaveBeenCalledWith('thing', 0, { limitToResourceClass: 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing'});

      expect(testHostComponent.inputValueComponent.resources.length).toEqual(1);

      // simulate user input
      const res = new ReadResource();
      res.id = 'http://rdfh.ch/0001/IwMDbs0KQsaxSRUTl2cAIQ';
      res.label = 'hidden thing';

      expect(testHostComponent.inputValueComponent.form.valid).toBeFalsy();

      testHostComponent.inputValueComponent.valueFormControl.setValue(res);

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      const newValue = testHostComponent.inputValueComponent.getNewValue();

      expect(newValue instanceof CreateLinkValue).toBeTruthy();

      expect((newValue as CreateLinkValue).linkedResourceIri).toEqual('http://rdfh.ch/0001/IwMDbs0KQsaxSRUTl2cAIQ');

    });
    it('should reset form after cancellation', () => {
      // simulate user input
      const res = new ReadResource();
      res.id = 'http://rdfh.ch/0001/IwMDbs0KQsaxSRUTl2cAIQ';
      res.label = 'hidden thing';
      testHostComponent.inputValueComponent.valueFormControl.setValue(res);

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
