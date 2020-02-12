import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {DisplayEditComponent} from './display-edit.component';
import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {
  KnoraApiConfig,
  KnoraApiConnection,
  MockResource,
  ReadIntValue,
  ReadResource,
  ReadValue,
  UpdateIntValue,
  UpdateValue,
  WriteValueResponse
} from '@knora/api';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {of} from 'rxjs';
import {KnoraApiConnectionToken} from '../../../core';

@Component({
  selector: `lib-text-value-as-string`,
  template: ``
})
class TestTextValueAsStringComponent {

  @Input() mode;

  @Input() displayValue;
}

@Component({
  selector: `lib-int-value`,
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

/**
 * Test host component to simulate parent component.
 */
@Component({
  selector: `lib-host-component`,
  template: `
    <lib-display-edit #displayEditVal [parentResource]="readResource" [displayValue]="readValue"></lib-display-edit>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('displayEditVal', {static: false}) displayEditValueComponent: DisplayEditComponent;

  readResource: ReadResource;
  readValue: ReadValue;

  mode: 'read' | 'update' | 'create' | 'search';

  constructor(@Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection) {
  }

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

describe('DisplayEditComponent', () => {
  let testHostComponent: TestHostDisplayValueComponent;
  let testHostFixture: ComponentFixture<TestHostDisplayValueComponent>;
  let config: KnoraApiConfig;
  let knoraApiConnection: KnoraApiConnection;

  beforeEach(async(() => {

    config = new KnoraApiConfig('http', '0.0.0.0', 3333, undefined, undefined, true);
    knoraApiConnection = new KnoraApiConnection(config);

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule
      ],
      declarations: [
        DisplayEditComponent,
        TestHostDisplayValueComponent,
        TestTextValueAsStringComponent,
        TestIntValueComponent
      ],
      providers: [
        {
          provide: KnoraApiConnectionToken,
          useValue: knoraApiConnection
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

    it('should save a new version of a value', inject([KnoraApiConnectionToken], (knoraApiCon) => {

      const updateValueSpy = spyOn(knoraApiCon.v2.values, 'updateValue');

      updateValueSpy.and.callFake(
        () => {

          const response = new WriteValueResponse();

          response.id = 'newID';
          response.type = 'type';

          return of(response);
        }
      );

      const readValueSpy = spyOn(knoraApiCon.v2.values, 'getValue');

      readValueSpy.and.callFake(
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

      testHostComponent.displayEditValueComponent.displayValueComponent.form.controls.test.clearValidators();
      testHostComponent.displayEditValueComponent.displayValueComponent.form.controls.test.updateValueAndValidity();

      testHostFixture.detectChanges();

      const saveButtonDebugElement = displayEditComponentDe.query(By.css('button.save'));
      const saveButtonNativeElement = saveButtonDebugElement.nativeElement;

      expect(saveButtonNativeElement.disabled).toBeFalsy();

      saveButtonNativeElement.click();

      testHostFixture.detectChanges();

      // expect(updateValueSpy).toHaveBeenCalledWith();
      expect(updateValueSpy).toHaveBeenCalledTimes(1);

      expect(readValueSpy).toHaveBeenCalledTimes(1);
      expect(readValueSpy).toHaveBeenCalledWith(testHostComponent.readResource.id, testHostComponent.readValue.uuid);

      expect(testHostComponent.displayEditValueComponent.displayValue.id).toEqual('newID');
    }));

  });
});
