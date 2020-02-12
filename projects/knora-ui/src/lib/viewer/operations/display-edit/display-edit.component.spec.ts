import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DisplayEditComponent} from './display-edit.component';
import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {KnoraApiConfig, KnoraApiConnection, MockResource, ReadResource, ReadValue} from '@knora/api';
import {KnoraApiConnectionToken} from 'knora-ui';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';

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

    this.form = {
      valid: false
    };

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

  let hostCompDe;

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

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();

    hostCompDe = testHostFixture.debugElement;

    expect(testHostComponent).toBeTruthy();
    expect(testHostComponent.displayEditValueComponent).toBeTruthy();
  });

  describe('change from display to edit mode', () => {

    it('should display an edit button if the user has the necessary permissions', () => {
      expect(testHostComponent.displayEditValueComponent.canModify).toBeTruthy();
    });

    it('should switch to edit mode when the edit button is clicked', () => {

      const displayEditComponentDe = hostCompDe.query(By.directive(DisplayEditComponent));
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

  });
});
