import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkValueComponent } from './link-value.component';
import { ReadLinkValue, MockResource, UpdateValue, UpdateLinkValue, CreateLinkValue } from '@knora/api';
import { OnInit, Component, ViewChild, DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {KnoraApiConnectionToken} from '../../../core';
import { $ } from 'protractor';
import { By } from '@angular/platform-browser';

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <kui-link-value #inputVal [displayValue]="displayInputVal" [mode]="mode"></kui-link-value>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('inputVal', {static: false}) inputValueComponent: LinkValueComponent;

  displayInputVal: ReadLinkValue;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      const inputVal: ReadLinkValue =
        res[0].getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThingValue', ReadLinkValue)[0];

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
    <kui-link-value #inputVal [mode]="mode"></kui-link-value>`
})
class TestHostCreateValueComponent implements OnInit {

  @ViewChild('inputVal', {static: false}) inputValueComponent: LinkValueComponent;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    this.mode = 'create';

  }
}

describe('LinkValueComponent', () => {

  beforeEach(async(() => {
    const valuesSpyObj = {
      v2: {
        values: jasmine.createSpyObj('values', ['updateValue', 'getValue'])
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

    beforeEach(() => {
      testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
      testHostComponent = testHostFixture.componentInstance;
      testHostFixture.detectChanges();
    });

    it('should display an existing value', () => {

      expect(testHostComponent.displayInputVal.linkedResourceIri).toMatch('http://rdfh.ch/0001/0C-0L1kORryKzJAJxxRyRQ');

      // expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();
      //
      // expect(testHostComponent.inputValueComponent.mode).toEqual('read');
      //
      // expect(valueInputNativeElement.value).toEqual('Sierra');
      //
      // expect(valueInputNativeElement.readOnly).toEqual(true);

    });
  });
});
