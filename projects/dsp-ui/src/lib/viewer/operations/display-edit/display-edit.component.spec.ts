import { OverlayContainer } from '@angular/cdk/overlay';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    ApiResponseError, Constants,
    DeleteValue,
    DeleteValueResponse,
    MockResource,
    MockUsers,
    ReadBooleanValue,
    ReadColorValue,
    ReadDecimalValue,
    ReadGeonameValue,
    ReadIntervalValue,
    ReadIntValue,
    ReadLinkValue,
    ReadListValue,
    ReadResource,
    ReadTextValueAsHtml,
    ReadTextValueAsString,
    ReadTimeValue,
    ReadUriValue,
    ReadValue,
    UpdateIntValue,
    UpdateResource,
    UpdateValue, UserResponse,
    UsersEndpointAdmin,
    ValuesEndpointV2,
    WriteValueResponse
} from '@dasch-swiss/dsp-js';
import { AsyncSubject, of, throwError } from 'rxjs';
import { AjaxError } from 'rxjs/ajax';
import { DspApiConnectionToken } from '../../../core';
import {
    DeletedEventValue,
    EmitEvent,
    Events,
    UpdatedEventValues,
    ValueOperationEventService
} from '../../services/value-operation-event.service';
import { ValueService } from '../../services/value.service';
import { DisplayEditComponent } from './display-edit.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: `dsp-text-value-as-string`,
  template: ``
})
class TestTextValueAsStringComponent {

  @Input() mode;

  @Input() displayValue;
}

@Component({
  selector: `dsp-list-value`,
  template: ``
})
class TestListValueComponent {
  @Input() mode;

  @Input() displayValue;

  @Input() propertyDef;
}

@Component({
  selector: `dsp-link-value`,
  template: ``
})
class TestLinkValueComponent {

  @Input() mode;

  @Input() displayValue;

  @Input() parentResource;

  @Input() propIri;
}

@Component({
  selector: `dsp-text-value-as-html`,
  template: ``
})
class TestTextValueAsHtmlComponent {

  @Input() mode;

  @Input() displayValue;
}

@Component({
  selector: `dsp-uri-value`,
  template: ``
})
class TestUriValueComponent {

  @Input() mode;

  @Input() displayValue;
}

@Component({
  selector: `dsp-int-value`,
  template: ``
})
class TestIntValueComponent implements OnInit {

  @Input() mode;

  @Input() displayValue;

  form: FormGroup;

  valueFormControl: FormControl;

  constructor(@Inject(FormBuilder) private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.valueFormControl = new FormControl(null, [Validators.required]);

    this.form = this._fb.group({
        test: this.valueFormControl
    });
  }

  getUpdatedValue(): UpdateValue {
    const updateIntVal = new UpdateIntValue();

    updateIntVal.id = this.displayValue.id;
    updateIntVal.int = 1;

    return updateIntVal;
  }

  updateCommentVisibility(): void { }
}

@Component({
  selector: `dsp-boolean-value`,
  template: ``
})
class TestBooleanValueComponent {

  @Input() mode;

  @Input() displayValue;

}

@Component({
  selector: `dsp-interval-value`,
  template: ``
})
class TestIntervalValueComponent {

  @Input() mode;

  @Input() displayValue;

}

@Component({
  selector: `dsp-decimal-value`,
  template: ``
})
class TestDecimalValueComponent {

  @Input() mode;

  @Input() displayValue;

}

@Component({
  selector: `dsp-time-value`,
  template: ``
})
class TestTimeValueComponent {
  @Input() mode;

  @Input() displayValue;
}

@Component({
  selector: `dsp-color-value`,
  template: ``
})
class TestColorValueComponent {
  @Input() mode;

  @Input() displayValue;
}

@Component({
  selector: `dsp-geoname-value`,
  template: ``
})
class TestGeonameValueComponent {

  @Input() mode;

  @Input() displayValue;

}

@Component({
  selector: `dsp-date-value`,
  template: ``
})
class TestDateValueComponent {
  @Input() mode;

  @Input() displayValue;
}

/**
 * Test host component to simulate parent component.
 */
@Component({
  selector: `lib-host-component`,
  template: `
    <dsp-display-edit *ngIf="readValue" #displayEditVal [parentResource]="readResource"
                      [displayValue]="readValue"></dsp-display-edit>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('displayEditVal') displayEditValueComponent: DisplayEditComponent;

  readResource: ReadResource;
  readValue: ReadValue;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      this.readResource = res;

      this.mode = 'read';
    });
  }

  // assigns a value when called -> dsp-display-edit will be instantiated
  assignValue(prop: string, comment?: string) {
    const readVal =
      this.readResource.getValues(prop)[0];

    readVal.userHasPermission = 'M';

    readVal.valueHasComment = comment;
    this.readValue = readVal;
  }
}

describe('DisplayEditComponent', () => {
  let testHostComponent: TestHostDisplayValueComponent;
  let testHostFixture: ComponentFixture<TestHostDisplayValueComponent>;

  beforeEach(async(() => {

    const valuesSpyObj = {
        v2: {
            values: jasmine.createSpyObj('values', ['updateValue', 'getValue', 'deleteValue'])
        }
    };

    const eventSpy = jasmine.createSpyObj('ValueOperationEventService', ['emit']);

    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUser']);

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatIconModule,
        MatDialogModule,
        MatTooltipModule,
        ReactiveFormsModule
      ],
      declarations: [
        DisplayEditComponent,
        TestHostDisplayValueComponent,
        TestTextValueAsStringComponent,
        TestTextValueAsHtmlComponent,
        TestIntValueComponent,
        TestLinkValueComponent,
        TestIntervalValueComponent,
        TestListValueComponent,
        TestBooleanValueComponent,
        TestUriValueComponent,
        TestDecimalValueComponent,
        TestGeonameValueComponent,
        TestTimeValueComponent,
        TestColorValueComponent,
        TestDateValueComponent
      ],
      providers: [
        {
          provide: DspApiConnectionToken,
          useValue: valuesSpyObj
        },
        {
            provide: ValueOperationEventService,
            useValue: eventSpy
        },
        {
            provide: UserService,
            useValue: userServiceSpy
        },
        {
            provide: MAT_DIALOG_DATA,
            useValue: {}
        },
        {
            provide: MatDialogRef,
            useValue: {}
        }
      ]
    })
      .compileComponents();

  }));

  beforeEach(() => {

    const userSpy = TestBed.inject(UserService);

    // mock getUserByIri response
    (userSpy as jasmine.SpyObj<UserService>).getUser.and.callFake(
        () => {
            const user = MockUsers.mockUser();

            const subj: AsyncSubject<UserResponse> = new AsyncSubject();
            subj.next(user.body);
            subj.complete();

            return subj;
        }
    );

    testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();

    expect(testHostComponent).toBeTruthy();
  });

  describe('display a value with the appropriate component', () => {

    it('should choose the apt component for a plain text value in the template', () => {

      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasText');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestTextValueAsStringComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue instanceof ReadTextValueAsString).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

    it('should choose the apt component for an HTML text value in the template', () => {

      const inputVal: ReadTextValueAsHtml = new ReadTextValueAsHtml();

      inputVal.hasPermissions = 'CR knora-admin:Creator|M knora-admin:ProjectMember|V knora-admin:KnownUser|RV knora-admin:UnknownUser';
      inputVal.userHasPermission = 'CR';
      inputVal.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
      inputVal.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/TEST_ID';
      inputVal.html =
        '<p>This is a <b>very</b> simple HTML document with a <a href="https://www.google.ch" target="_blank" class="dsp-link">link</a></p>';

      testHostComponent.readValue = inputVal;

      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestTextValueAsHtmlComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue instanceof ReadTextValueAsHtml).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

    it('should choose the apt component for an integer value in the template', () => {
      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent).toBeTruthy();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestIntValueComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue instanceof ReadIntValue).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

    it('should choose the apt component for a boolean value in the template', () => {
      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasBoolean');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent).toBeTruthy();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestBooleanValueComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue instanceof ReadBooleanValue).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

    it('should choose the apt component for a URI value in the template', () => {
      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasUri');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent).toBeTruthy();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestUriValueComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue instanceof ReadUriValue).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

    it('should choose the apt component for a decimal value in the template', () => {

      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestDecimalValueComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue instanceof ReadDecimalValue).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

    it('should choose the apt component for a color value in the template', () => {

      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasColor');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestColorValueComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue instanceof ReadColorValue).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

    it('should choose the apt component for an interval value in the template', () => {

      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInterval');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestIntervalValueComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue instanceof ReadIntervalValue).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

    it('should choose the apt component for a time value in the template', () => {

      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasTimeStamp');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestTimeValueComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue instanceof ReadTimeValue).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

    it('should choose the apt component for a link value in the template', () => {

      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThingValue');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestLinkValueComponent).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue instanceof ReadLinkValue).toBe(true);
      expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
      expect((testHostComponent.displayEditValueComponent.displayValueComponent as unknown as TestLinkValueComponent).parentResource instanceof ReadResource).toBe(true);
      expect((testHostComponent.displayEditValueComponent.displayValueComponent as unknown as TestLinkValueComponent).propIri).toEqual('http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThingValue');

    });

    it('should choose the apt component for a list value in the template', () => {
        testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasListItem');
        testHostFixture.detectChanges();

        expect(testHostComponent.displayEditValueComponent).toBeTruthy();

        expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestListValueComponent).toBe(true);
        expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue instanceof ReadListValue).toBe(true);
        expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

    it('should choose the apt component for a geoname value in the template', () => {
        testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasGeoname');
        testHostFixture.detectChanges();

        expect(testHostComponent.displayEditValueComponent).toBeTruthy();

        expect(testHostComponent.displayEditValueComponent.displayValueComponent instanceof TestGeonameValueComponent).toBe(true);
        expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue instanceof ReadGeonameValue).toBe(true);
        expect(testHostComponent.displayEditValueComponent.displayValueComponent.mode).toEqual('read');
    });

  });

  describe('methods getValueType and isReadOnly', () => {
    let hostCompDe;
    let displayEditComponentDe;
    let valueService;

    beforeEach(() => {
      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent).toBeTruthy();

      hostCompDe = testHostFixture.debugElement;
      displayEditComponentDe = hostCompDe.query(By.directive(DisplayEditComponent));

      valueService = TestBed.inject(ValueService);

    });

    it('should return the type of a integer value as not readonly', () => {
      expect(valueService.getValueTypeOrClass(testHostComponent.displayEditValueComponent.displayValue)).toEqual(Constants.IntValue);

      expect(valueService.isReadOnly(Constants.IntValue, testHostComponent.displayEditValueComponent.displayValue)).toBe(false);
    });

    it('should return the class of a html text value as readonly', () => {

      const htmlTextVal = new ReadTextValueAsHtml();
      htmlTextVal.type = Constants.TextValue;

      expect(valueService.getValueTypeOrClass(htmlTextVal)).toEqual('ReadTextValueAsHtml');

      expect(valueService.isReadOnly('ReadTextValueAsHtml', htmlTextVal)).toBe(true);

    });

    it('should return the type of a plain text value as not readonly', () => {

      const plainTextVal = new ReadTextValueAsString();
      plainTextVal.type = Constants.TextValue;

      expect(valueService.getValueTypeOrClass(plainTextVal)).toEqual('ReadTextValueAsString');

      expect(valueService.isReadOnly('ReadTextValueAsString', plainTextVal)).toBe(false);

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

      testHostComponent.displayEditValueComponent.showActionBubble = true;
      testHostFixture.detectChanges();


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

        const valueEventSpy = TestBed.inject(ValueOperationEventService);

        const valuesSpy = TestBed.inject(DspApiConnectionToken);

        (valueEventSpy as jasmine.SpyObj<ValueOperationEventService>).emit.and.stub();

        (valuesSpy.v2.values as jasmine.SpyObj<ValuesEndpointV2>).updateValue.and.callFake(
            () => {

                const response = new WriteValueResponse();

                response.id = 'newID';
                response.type = 'type';
                response.uuid = 'uuid';

                return of(response);
            }
        );

        (valuesSpy.v2.values as jasmine.SpyObj<ValuesEndpointV2>).getValue.and.callFake(
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

        expect(valueEventSpy.emit).toHaveBeenCalledTimes(1);
        expect(valueEventSpy.emit).toHaveBeenCalledWith(new EmitEvent(Events.ValueUpdated, new UpdatedEventValues(
            testHostComponent.readValue, testHostComponent.displayEditValueComponent.displayValue)));

        expect(valuesSpy.v2.values.getValue).toHaveBeenCalledTimes(1);
        expect(valuesSpy.v2.values.getValue).toHaveBeenCalledWith(testHostComponent.readResource.id, 'uuid');

        expect(testHostComponent.displayEditValueComponent.displayValue.id).toEqual('newID');
        expect(testHostComponent.displayEditValueComponent.displayValueComponent.displayValue.id).toEqual('newID');
        expect(testHostComponent.displayEditValueComponent.mode).toEqual('read');



    });

    it('should handle an ApiResponseError with status of 400 correctly', () => {

        const valuesSpy = TestBed.inject(DspApiConnectionToken);

        const error = ApiResponseError.fromAjaxError({} as AjaxError);

        error.status = 400;

        (valuesSpy.v2.values as jasmine.SpyObj<ValuesEndpointV2>).updateValue.and.returnValue(throwError(error));

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

        const formErrors = testHostComponent.displayEditValueComponent.displayValueComponent.valueFormControl.errors;

        const expectedErrors = {
            duplicateValue: true
        };

        expect(formErrors).toEqual(expectedErrors);

    });

  });

  describe('do not change from display to edit mode for an html text value', () => {
    let hostCompDe;
    let displayEditComponentDe;

    it('should not display the edit button', () => {
      const inputVal: ReadTextValueAsHtml = new ReadTextValueAsHtml();

      inputVal.hasPermissions = 'CR knora-admin:Creator|M knora-admin:ProjectMember|V knora-admin:KnownUser|RV knora-admin:UnknownUser';
      inputVal.userHasPermission = 'CR';
      inputVal.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
      inputVal.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/TEST_ID';
      inputVal.html =
        '<p>This is a <b>very</b> simple HTML document with a <a href="https://www.google.ch" target="_blank" class="dsp-link">link</a></p>';

      testHostComponent.readValue = inputVal;

      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent).toBeTruthy();

      hostCompDe = testHostFixture.debugElement;
      displayEditComponentDe = hostCompDe.query(By.directive(DisplayEditComponent));

      const editButtonDebugElement = displayEditComponentDe.query(By.css('button.edit'));
      expect(editButtonDebugElement).toBe(null);


    });

  });

  describe('comment toggle button', () => {
    let hostCompDe;
    let displayEditComponentDe;

    beforeEach(() => {
      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger', 'comment');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent).toBeTruthy();

      hostCompDe = testHostFixture.debugElement;
      displayEditComponentDe = hostCompDe.query(By.directive(DisplayEditComponent));

      testHostComponent.displayEditValueComponent.showActionBubble = true;
      testHostFixture.detectChanges();
    });

    it('should display a comment button if the value has a comment', () => {
      expect(testHostComponent.displayEditValueComponent.editModeActive).toBeFalsy();
      expect(testHostComponent.displayEditValueComponent.shouldShowCommentToggle).toBeTruthy()

      const commentButtonDebugElement = displayEditComponentDe.query(By.css('button.comment-toggle'));

      expect(commentButtonDebugElement).toBeTruthy();
      expect(commentButtonDebugElement.nativeElement).toBeTruthy();

    });

    it('should not display a comment button if the comment is deleted', () => {

      const valuesSpy = TestBed.inject(DspApiConnectionToken);

      (valuesSpy.v2.values as jasmine.SpyObj<ValuesEndpointV2>).updateValue.and.callFake(
        () => {

          const response = new WriteValueResponse();

          response.id = 'newID';
          response.type = 'type';
          response.uuid = 'uuid';

          return of(response);
        }
      );

      (valuesSpy.v2.values as jasmine.SpyObj<ValuesEndpointV2>).getValue.and.callFake(
        () => {

          const updatedVal = new ReadIntValue();

          updatedVal.id = 'newID';
          updatedVal.int = 1;
          updatedVal.valueHasComment = '';

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

      expect(testHostComponent.displayEditValueComponent.shouldShowCommentToggle).toBeTruthy();

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
      expect(testHostComponent.displayEditValueComponent.displayValue.valueHasComment).toEqual('');

      expect(testHostComponent.displayEditValueComponent.shouldShowCommentToggle).toBeFalsy();
      expect(testHostComponent.displayEditValueComponent.mode).toEqual('read');

    });

  });

  describe('deleteValue method', () => {
    let hostCompDe;
    let displayEditComponentDe;
    let rootLoader: HarnessLoader;
    let overlayContainer: OverlayContainer;

    beforeEach(() => {
      testHostComponent.assignValue('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger');
      testHostFixture.detectChanges();

      expect(testHostComponent.displayEditValueComponent).toBeTruthy();

      hostCompDe = testHostFixture.debugElement;
      displayEditComponentDe = hostCompDe.query(By.directive(DisplayEditComponent));

      testHostComponent.displayEditValueComponent.showActionBubble = true;
      testHostFixture.detectChanges();

      overlayContainer = TestBed.inject(OverlayContainer);
      rootLoader = TestbedHarnessEnvironment.documentRootLoader(testHostFixture);
    });

    afterEach(async () => {
        const dialogs = await rootLoader.getAllHarnesses(MatDialogHarness);
        await Promise.all(dialogs.map(async d => await d.close()));

        // Angular won't call this for us so we need to do it ourselves to avoid leaks.
        overlayContainer.ngOnDestroy();
    });

    it('should delete a value from a property', async () => {
        const valueEventSpy = TestBed.inject(ValueOperationEventService);

        const valuesSpy = TestBed.inject(DspApiConnectionToken);

        (valueEventSpy as jasmine.SpyObj<ValueOperationEventService>).emit.and.stub();

        (valuesSpy.v2.values as jasmine.SpyObj<ValuesEndpointV2>).deleteValue.and.callFake(
            () => {

                const response = new DeleteValueResponse();

                response.result = 'success';

                return of(response);
            }
        );

        const deleteButton = await rootLoader.getHarness(MatButtonHarness.with({selector: '.delete'}));
        await deleteButton.click();

        const dialogHarnesses = await rootLoader.getAllHarnesses(MatDialogHarness);

        expect(dialogHarnesses.length).toEqual(1);

        const okButton = await rootLoader.getHarness(MatButtonHarness.with({selector: '.ok'}));

        await okButton.click();

        const expectedUpdateResource = new UpdateResource();

        expectedUpdateResource.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';
        expectedUpdateResource.type = 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing';
        expectedUpdateResource.property = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger';

        const deleteVal = new DeleteValue();
        deleteVal.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/dJ1ES8QTQNepFKF5-EAqdg';
        deleteVal.type = 'http://api.knora.org/ontology/knora-api/v2#IntValue';
        deleteVal.deleteComment = undefined;

        expectedUpdateResource.value = deleteVal;

        testHostFixture.whenStable().then(() => {
            expect(valuesSpy.v2.values.deleteValue).toHaveBeenCalledWith(expectedUpdateResource);
            expect(valuesSpy.v2.values.deleteValue).toHaveBeenCalledTimes(1);

            expect(valueEventSpy.emit).toHaveBeenCalledTimes(1);
            expect(valueEventSpy.emit).toHaveBeenCalledWith(new EmitEvent(Events.ValueDeleted, new DeletedEventValue(deleteVal)));
        });

    });

    it('should send a deletion comment to Knora if one is provided', async () => {
        const valueEventSpy = TestBed.inject(ValueOperationEventService);

        const valuesSpy = TestBed.inject(DspApiConnectionToken);

        (valueEventSpy as jasmine.SpyObj<ValueOperationEventService>).emit.and.stub();

        (valuesSpy.v2.values as jasmine.SpyObj<ValuesEndpointV2>).deleteValue.and.callFake(
            () => {

                const response = new DeleteValueResponse();

                response.result = 'success';

                return of(response);
            }
        );

        testHostComponent.displayEditValueComponent.deleteValue('my deletion comment');

        const expectedUpdateResource = new UpdateResource();

        expectedUpdateResource.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';
        expectedUpdateResource.type = 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing';
        expectedUpdateResource.property = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger';

        const deleteVal = new DeleteValue();
        deleteVal.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/dJ1ES8QTQNepFKF5-EAqdg';
        deleteVal.type = 'http://api.knora.org/ontology/knora-api/v2#IntValue';
        deleteVal.deleteComment = 'my deletion comment';

        expectedUpdateResource.value = deleteVal;

        testHostFixture.whenStable().then(() => {
            expect(valuesSpy.v2.values.deleteValue).toHaveBeenCalledWith(expectedUpdateResource);
            expect(valuesSpy.v2.values.deleteValue).toHaveBeenCalledTimes(1);
        });
    });
  });
});
