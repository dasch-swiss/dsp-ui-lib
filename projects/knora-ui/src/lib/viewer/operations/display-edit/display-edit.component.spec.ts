import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DisplayEditComponent} from './display-edit.component';
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {
  Constants,
  MockResource,
  ReadIntValue,
  ReadResource,
  ReadTextValueAsHtml,
  ReadTextValueAsString,
  ReadTextValueAsXml,
  ReadValue,
  UpdateIntValue,
  UpdateResource,
  UpdateValue,
  WriteValueResponse
} from '@knora/api';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {of} from 'rxjs';
import {KnoraApiConnectionToken} from '../../../core';

@Component({
  selector: `kui-text-value-as-string`,
  template: ``
})
class TestTextValueAsStringComponent {

  @Input() mode;

  @Input() displayValue;
}

@Component({
  selector: `kui-link-value`,
  template: ``
})
class TestLinkValueComponent {

  @Input() mode;

  @Input() displayValue;
  @Input() parentResource;
  @Input() propIri;
}

@Component({
  selector: `kui-text-value-as-html`,
  template: ``
})
class TestTextValueAsHtmlComponent {

  @Input() mode;

  @Input() displayValue;
}

@Component({
  selector: `kui-uri-value`,
  template: ``
})
class TestUriValueComponent {

  @Input() mode;

  @Input() displayValue;
}

@Component({
  selector: `kui-int-value`,
  template: ``
})
class TestIntValueComponent implements OnInit {

  @Input() mode;

  @Input() displayValue;

  form: object;

  ngOnInit(): void {

    this.form = new FormGroup({
      test: new FormControl(null, [Validators.required])
    });
  }

  getUpdatedValue(): UpdateValue {
    const updateIntVal = new UpdateIntValue();

    updateIntVal.id = this.displayValue.id;
    updateIntVal.int = 1;

    return updateIntVal;
  }
}

@Component({
  selector: `kui-boolean-value`,
  template: ``
})
class TestBooleanValueComponent {

  @Input() mode;

  @Input() displayValue;

}

@Component({
  selector: `kui-interval-value`,
  template: ``
})
class TestIntervalValueComponent {

  @Input() mode;

  @Input() displayValue;

}

@Component({
  selector: `kui-decimal-value`,
  template: ``
})
class TestDecimalValueComponent {

  @Input() mode;

  @Input() displayValue;

}

@Component({
  selector: `kui-time-value`,
  template: ``
})
class TestTimeValueComponent {
  @Input() mode;

  @Input() displayValue;
}

@Component({
  selector: `kui-color-value`,
  template: ``
})
class TestColorValueComponent {
  @Input() mode;

  @Input() displayValue;
}

/**
 * Test host component to simulate parent component.
 */
@Component({
  selector: `lib-host-component`,
  template: `
    <kui-display-edit *ngIf="readValue" #displayEditVal [parentResource]="readResource"
                      [displayValue]="readValue"></kui-display-edit>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('displayEditVal', {static: false}) displayEditValueComponent: DisplayEditComponent;

  readResource: ReadResource;
  readValue: ReadValue;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      this.readResource = res[0];

      this.mode = 'read';
    });
  }

  // assigns a value when called -> kui-display-edit will be instantiated
  assignValue(prop: string) {
    const readVal =
      this.readResource.getValues(prop)[0];

    readVal.userHasPermission = 'M';

    this.readValue = readVal;
  }
}

describe('DisplayEditComponent', () => {
  let testHostComponent: TestHostDisplayValueComponent;
  let testHostFixture: ComponentFixture<TestHostDisplayValueComponent>;

  beforeEach(async(() => {

    const valuesSpyObj = {
      v2: {
        values: jasmine.createSpyObj('values', ['updateValue', 'getValue'])
      }
    };

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
      ],
      declarations: [
        DisplayEditComponent,
        TestHostDisplayValueComponent,
        TestTextValueAsStringComponent,
        TestTextValueAsHtmlComponent,
        TestIntValueComponent,
        TestLinkValueComponent,
        TestIntervalValueComponent,
        TestBooleanValueComponent,
        TestUriValueComponent,
        TestDecimalValueComponent,
        TestTimeValueComponent,
        TestColorValueComponent
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

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();

    expect(testHostComponent).toBeTruthy();
  });

  describe('display a value with the appropriate component', () => {

    it('should choose the apt component for an plain text value in the template', () => {

      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasText');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestTextValueAsStringComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue).not.toBeUndefined();
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

    it('should choose the apt component for an HTML text value in the template', () => {

      const inputVal: ReadTextValueAsHtml = new ReadTextValueAsHtml();

      inputVal.hasPermissions = 'CR knora-admin:Creator|M knora-admin:ProjectMember|V knora-admin:KnownUser|RV knora-admin:UnknownUser';
      inputVal.userHasPermission = 'CR';
      inputVal.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
      inputVal.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/TEST_ID';
      inputVal.html =
        '<p>This is a <b>very</b> simple HTML document with a <a href="https://www.google.ch" target="_blank" class="kui-link">link</a></p>';

      testHostComponent.readValue = inputVal;

      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestTextValueAsHtmlComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue).not.toBeUndefined();
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

    it('should choose the apt component for an integer value in the template', () => {
      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent).toBeTruthy();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestIntValueComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue).not.toBeUndefined();
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

    it('should choose the apt component for a boolean value in the template', () => {
      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasBoolean');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent).toBeTruthy();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestBooleanValueComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue).not.toBeUndefined();
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

    it('should choose the apt component for a URI value in the template', () => {
      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasUri');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent).toBeTruthy();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestUriValueComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue).not.toBeUndefined();
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

    it('should choose the apt component for an decimal value in the template', () => {

      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestDecimalValueComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue).not.toBeUndefined();
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

    it('should choose the apt component for a color value in the template', () => {

      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasColor');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestColorValueComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue).not.toBeUndefined();
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

    it('should choose the apt component for an interval value in the template', () => {

      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInterval');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestIntervalValueComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue).not.toBeUndefined();
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

    it('should choose the apt component for a time value in the template', () => {

      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasTimeStamp');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestTimeValueComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue).not.toBeUndefined();
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

    it('should choose the apt component for a link value in the template', () => {

      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThingValue');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestLinkValueComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue).not.toBeUndefined();
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
      expect((testHostComponent.displayEditValueComponent.displayValueComponent as unknown as TestLinkValueComponent).parentResource instanceof ReadResource).toBe(true);
      expect((testHostComponent.displayEditValueComponent.displayValueComponent as unknown as TestLinkValueComponent).propIri).toEqual('http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThingValue');

    });

  });

  describe('methods getValueType and isReadOnly', () => {
    let hostCompDe;
    let displayEditComponentDe;

    beforeEach(() => {
      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent).toBeTruthy();

      hostCompDe = testHostFixture.debugElement;
      displayEditComponentDe = hostCompDe.query(By.directive(DisplayEditComponent));

    });

    it('should return the type of a integer value as not readonly', () => {

      expect(testHostComponent.displayEditValueComponent.getValueTypeOrClass(testHostComponent.displayEditValueComponent.displayValue)).toEqual(Constants.IntValue);

      expect(testHostComponent.displayEditValueComponent.isReadOnly(Constants.IntValue)).toBe(false);
    });

    it('should return the class of a html text value as readonly', () => {

      const htmlTextVal = new ReadTextValueAsHtml();
      htmlTextVal.type = Constants.TextValue;

      expect(testHostComponent.displayEditValueComponent.getValueTypeOrClass(htmlTextVal)).toEqual('ReadTextValueAsHtml');

      expect(testHostComponent.displayEditValueComponent.isReadOnly('ReadTextValueAsHtml')).toBe(true);

    });

    it('should return the class of an XML text value as not readonly', () => {

      const htmlTextVal = new ReadTextValueAsXml();
      htmlTextVal.type = Constants.TextValue;

      expect(testHostComponent.displayEditValueComponent.getValueTypeOrClass(htmlTextVal)).toEqual('ReadTextValueAsXml');

      expect(testHostComponent.displayEditValueComponent.isReadOnly('ReadTextValueAsXml')).toBe(false);

    });

    it('should return the type of a plain text value as not readonly', () => {

      const plainTextVal = new ReadTextValueAsString();
      plainTextVal.type = Constants.TextValue;

      expect(testHostComponent.displayEditValueComponent.getValueTypeOrClass(plainTextVal)).toEqual('ReadTextValueAsString');

      expect(testHostComponent.displayEditValueComponent.isReadOnly('ReadTextValueAsString')).toBe(false);

    });

  });

  describe('change from display to edit mode', () => {
    let hostCompDe;
    let displayEditComponentDe;

    beforeEach(() => {
      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent).toBeTruthy();

      hostCompDe = testHostFixture.debugElement;
      displayEditComponentDe = hostCompDe.query(By.directive(DisplayEditComponent));

    });

    it('should display an edit button if the user has the necessary permissions', () => {
      expect(testHostComponent.displayEditValueComponent.canModify).toBeTruthy();
      expect(testHostComponent.displayEditValueComponent.editModeActive).toBeFalsy();

      const editButtonDebugElement = displayEditComponentDe.query(By.css('button.edit'));

      expect(editButtonDebugElement).toBeTruthy();
      expect(editButtonDebugElement.nativeElement).toBeTruthy();

    });

    it('should switch to edit mode when the edit button is clicked', () => {

      const editButtonDebugElement = displayEditComponentDe.query(By.css('button.edit'));
      const editButtonNativeElement = editButtonDebugElement.nativeElement;

      editButtonNativeElement.click();
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent.editModeActive).toBeTruthy();
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.form.valid).toBeFalsy();

      const saveButtonDebugElement = displayEditComponentDe.query(By.css('button.save'));
      const saveButtonNativeElement = saveButtonDebugElement.nativeElement;

      expect(saveButtonNativeElement.disabled).toBeTruthy();

    });

    it('should save a new version of a value', () => {

      const valuesSpy = TestBed.get(KnoraApiConnectionToken);

      valuesSpy.v2.values.updateValue.and.callFake(
        () => {

          const response = new WriteValueResponse();

          response.id = 'newID';
          response.type = 'type';
          response.uuid = 'uuid';

          return of(response);
        }
      );

      valuesSpy.v2.values.getValue.and.callFake(
        () => {

          const updatedVal = new ReadIntValue();

          updatedVal.id = 'newID';
          updatedVal.int = 1;

          const resource = new ReadResource();

          resource.properties = {
            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger': [updatedVal]
          };

          return of(resource);
        }
      );

      testHostComponent.displayEditValueComponent.canModify = true;
      testHostComponent.displayEditValueComponent.editModeActive = true;
      testHostComponent.displayEditValueComponent.mode = 'update';

      testHostComponent.displayEditValueComponent.displayValueComponent.form.controls.test.clearValidators();
      testHostComponent.displayEditValueComponent.displayValueComponent.form.controls.test.updateValueAndValidity();

      testHostFixture.detectChanges();

      const saveButtonDebugElement = displayEditComponentDe.query(By.css('button.save'));
      const saveButtonNativeElement = saveButtonDebugElement.nativeElement;

      expect(saveButtonNativeElement.disabled).toBeFalsy();

      saveButtonNativeElement.click();

      testHostFixture.detectChanges();

      const expectedUpdateResource = new UpdateResource();

      expectedUpdateResource.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';
      expectedUpdateResource.type = 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing';
      expectedUpdateResource.property = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger';

      const expectedUpdateVal = new UpdateIntValue();
      expectedUpdateVal.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/dJ1ES8QTQNepFKF5-EAqdg';
      expectedUpdateVal.int = 1;

      expectedUpdateResource.value = expectedUpdateVal;

      expect(valuesSpy.v2.values.updateValue).toHaveBeenCalledWith(expectedUpdateResource);
      expect(valuesSpy.v2.values.updateValue).toHaveBeenCalledTimes(1);

      expect(valuesSpy.v2.values.getValue).toHaveBeenCalledTimes(1);
      expect(valuesSpy.v2.values.getValue).toHaveBeenCalledWith(testHostComponent.readResource.id,
        'uuid');

      expect(testHostComponent.displayEditValueComponent.displayValue.id).toEqual('newID');
      expect(testHostComponent.displayEditValueComponent.mode).toEqual('read');

    });

  });

  describe('not change from display to edit mode for an html text value', () => {
    let hostCompDe;
    let displayEditComponentDe;

    it('should not display the edit button', () => {
      const inputVal: ReadTextValueAsHtml = new ReadTextValueAsHtml();

      inputVal.hasPermissions = 'CR knora-admin:Creator|M knora-admin:ProjectMember|V knora-admin:KnownUser|RV knora-admin:UnknownUser';
      inputVal.userHasPermission = 'CR';
      inputVal.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
      inputVal.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/TEST_ID';
      inputVal.html =
        '<p>This is a <b>very</b> simple HTML document with a <a href="https://www.google.ch" target="_blank" class="kui-link">link</a></p>';

      testHostComponent.readValue = inputVal;

      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent).toBeTruthy();

      hostCompDe = testHostFixture.debugElement;
      displayEditComponentDe = hostCompDe.query(By.directive(DisplayEditComponent));

      const editButtonDebugElement = displayEditComponentDe.query(By.css('button.edit'));
      expect(editButtonDebugElement).toBe(null);


    });

  });
});
