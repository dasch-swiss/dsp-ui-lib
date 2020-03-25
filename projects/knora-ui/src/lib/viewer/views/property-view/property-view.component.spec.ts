import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { IHasProperty, MockResource, PropertyDefinition, ReadResource, ReadValue, ResourcePropertyDefinition, SystemPropertyDefinition, UpdateDecimalValue, UpdateIntValue, UpdateValue } from '@knora/api';
import { ColorPickerModule } from 'ngx-color-picker';
import { DisplayEditComponent } from '../../operations/display-edit/display-edit.component';
import { PropertyInfoValues } from '../resource-view/resource-view.component';
import { PropertyViewComponent } from './property-view.component';
import { KnoraApiConnectionToken } from '../../../core';
import { By } from '@angular/platform-browser';

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
 * Test host component to simulate property-view component.
 */
@Component({
  selector: `kui-property-host-component`,
  template: `
    <kui-property-view #propView
      [parentResource]="resource"
      [propArray]="propArray"
      [systemPropArray]="systemPropArray"
    ></kui-property-view>`
})
class TestPropertyViewComponent implements OnInit {

  @ViewChild('propView', { static: false }) propertyViewComponent: PropertyViewComponent;

  resource: ReadResource;

  propArray: PropertyInfoValues[] = [];

  systemPropArray?: PropertyDefinition[] = [];

  ngOnInit() {

    MockResource.getTestthing().subscribe(response => {
      this.resource = response[0];
      const propsList: IHasProperty[] = this.resource.entityInfo.classes[this.resource.type].propertiesList;
      let i = 0;
      for (const prop of propsList) {
        const index = prop.propertyIndex;

        if (this.resource.entityInfo.properties[index] &&
          this.resource.entityInfo.properties[index] instanceof ResourcePropertyDefinition) {

          const propInfoAndValues: PropertyInfoValues = {
            guiDef: prop,
            propDef: this.resource.entityInfo.properties[index],
            values: this.resource.properties[index]
          };

          this.propArray.push(propInfoAndValues);
        } else if (this.resource.entityInfo.properties[index] &&
          this.resource.entityInfo.properties[index] instanceof SystemPropertyDefinition) {
          const systemPropInfo = this.resource.entityInfo.properties[index];

          this.systemPropArray.push(systemPropInfo);
        }
        i++;
      }
    });

  }
}

/**
 * Test host component to simulate display-edit component.
 */
@Component({
  selector: `kui-host-display-edit`,
  template: `
    <kui-display-edit #displayEditVal [parentResource]="readResource" [displayValue]="readValue"></kui-display-edit>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('displayEditVal', { static: false }) displayEditValueComponent: DisplayEditComponent;

  readResource: ReadResource;
  readValue: ReadValue;

  ngOnInit() {

  }
}

describe('PropertyViewComponent', () => {
  let testHostComponent: TestPropertyViewComponent;
  let testHostFixture: ComponentFixture<TestPropertyViewComponent>;
  let hostCompDe;
  let propViewComponentDe;

  const valuesSpyObj = {
    v2: {
      values: jasmine.createSpyObj('values', ['updateValue', 'getValue'])
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestPropertyViewComponent,
        TestHostDisplayValueComponent,
        PropertyViewComponent,
        DisplayEditComponent,
        TestTextValueAsStringComponent,
        TestIntValueComponent,
        TestIntervalValueComponent,
        TestBooleanValueComponent,
        TestUriValueComponent,
        TestDecimalValueComponent,
        TestTimeValueComponent,
        TestColorValueComponent
      ],
      imports: [
        ReactiveFormsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        ColorPickerModule
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
    testHostFixture = TestBed.createComponent(TestPropertyViewComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();

    hostCompDe = testHostFixture.debugElement;
    propViewComponentDe = hostCompDe.query(By.directive(PropertyViewComponent));
  });

  it('should create', () => {

    expect(testHostComponent).toBeTruthy();
    expect(testHostComponent.propertyViewComponent).toBeTruthy();

  });

  it('should get 25 properties', () => {

    expect(testHostComponent.propArray.length).toBe(25);

  });

  it('should get the resource testding', () => {

    expect(testHostComponent.resource).toBeTruthy();
    expect(testHostComponent.resource.id).toEqual('http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw');
    expect(testHostComponent.resource.label).toEqual('testding');

  });

  it('should display a text value among the property list', () => {

    expect(testHostComponent.propArray[8].propDef.label).toEqual('Text');
    expect(testHostComponent.propArray[8].propDef.comment).toBe(undefined);
    expect(testHostComponent.propArray[8].guiDef.cardinality).toEqual(2);
    expect(testHostComponent.propArray[8].guiDef.guiOrder).toEqual(2);
    expect(testHostComponent.propArray[8].values[0].type).toEqual('http://api.knora.org/ontology/knora-api/v2#TextValue');

  });

  it('should get some system properties', () => {

    expect(testHostComponent.systemPropArray.length).toEqual(14);

    // check if the first system property is an ARK url
    expect(testHostComponent.systemPropArray[0].label).toEqual('ARK URL');

  });


});
