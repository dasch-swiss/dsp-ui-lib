import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayEditComponent } from './display-edit.component';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  MockResource,
  ReadIntValue,
  ReadResource,
  ReadValue,
  UpdateDecimalValue,
  UpdateIntValue,
  UpdateValue,
  WriteValueResponse
} from '@knora/api';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { KnoraApiConnectionToken } from '../../../core';
import { MatIconModule } from '@angular/material';

@Component({
  selector: `kui-text-value-as-string`,
  template: ``
})
class TestTextValueAsStringComponent {

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

  updateCommentVisibility() : void { }

}

@Component({
  selector: `kui-boolean-value`,
  template: ``
})
class TestBooleanValueComponent implements OnInit {

  @Input() mode;

  @Input() displayValue;

  form: object;

  ngOnInit(): void {
    this.form = new FormGroup({
      test: new FormControl(null, [Validators.required])
    });
  }
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
class TestDecimalValueComponent implements OnInit {
  @Input() mode;

  @Input() displayValue;

  form: object;

  ngOnInit(): void {
    this.form = new FormGroup({
      test: new FormControl(null, [Validators.required])
    });
  }

  getUpdatedValue(): UpdateValue {
    const updateDecimalVal = new UpdateDecimalValue();

    updateDecimalVal.id = this.displayValue.id;
    updateDecimalVal.decimal = 1.5;

    return updateDecimalVal;
  }

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
    <kui-display-edit #displayEditVal [parentResource]="readResource" [displayValue]="readValue"></kui-display-edit>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('displayEditVal', { static: false }) displayEditValueComponent: DisplayEditComponent;

  readResource: ReadResource;
  readValue: ReadValue;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      this.readResource = res[0];
      const readVal =
        this.readResource.getValues('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger')[0];

      readVal.userHasPermission = 'M';

      this.readValue = readVal;

      this.mode = 'read';
    });

  }
}

fdescribe('DisplayEditComponent', () => {
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
        MatIconModule,
      ],
      declarations: [
        DisplayEditComponent,
        TestHostDisplayValueComponent,
        TestTextValueAsStringComponent,
        TestIntValueComponent,
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

  describe('change from display to edit mode', () => {
    let hostCompDe;
    let displayEditComponentDe;

    beforeEach(() => {
      testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
      testHostComponent = testHostFixture.componentInstance;
      testHostFixture.detectChanges();

      hostCompDe = testHostFixture.debugElement;
      displayEditComponentDe = hostCompDe.query(By.directive(DisplayEditComponent));

      expect(testHostComponent).toBeTruthy();
      expect(testHostComponent.displayEditValueComponent).toBeTruthy();
    });

    it('should display an edit button if the user has the necessary permissions', () => {
      expect(testHostComponent.displayEditValueComponent.canModify).toBeTruthy();
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

      // expect(updateValueSpy).toHaveBeenCalledWith();
      expect(valuesSpy.v2.values.updateValue).toHaveBeenCalledTimes(1);

      expect(valuesSpy.v2.values.getValue).toHaveBeenCalledTimes(1);
      expect(valuesSpy.v2.values.getValue).toHaveBeenCalledWith(testHostComponent.readResource.id, testHostComponent.readValue.uuid);

      expect(testHostComponent.displayEditValueComponent.displayValue.id).toEqual('newID');
      expect(testHostComponent.displayEditValueComponent.mode).toEqual('read');
    });

  });
});
