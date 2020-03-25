import { Component, Input, OnInit, ViewChild, OnChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IHasProperty, MockResource, PropertyDefinition, ReadResource, ReadValue, ResourcePropertyDefinition, SystemPropertyDefinition, UpdateDecimalValue, UpdateIntValue, UpdateValue } from '@knora/api';
import { DisplayEditComponent } from '../../operations/display-edit/display-edit.component';
import { PropertyViewComponent } from '../property-view/property-view.component';
import { PropertyInfoValues, ResourceViewComponent } from './resource-view.component';
import { KnoraApiConnectionToken } from '../../../core';
import { of } from 'rxjs/internal/observable/of';



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

  ngOnInit() { }
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

/**
 * Test host component to simulate resource-view component.
 */
@Component({
  selector: `kui-resource-host-component`,
  template: `
    <kui-resource-view #resView [iri]="resourceIri"></kui-resource-view>`
})
class TestResourceViewComponent implements OnChanges {

  @ViewChild('resView', { static: false }) resourceViewComponent: ResourceViewComponent;

  iri = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';

  resource: ReadResource;

  ngOnChanges() {
    this.getResource(this.iri);
  }

  getResource(iri: string) {
    MockResource.getTestthing().subscribe(response => {
      this.resource = response[0];
      this.iri = response[0].id;
    });
  }
}

describe('ResourceViewComponent', () => {
  let testHostComponent: TestResourceViewComponent;
  let testHostFixture: ComponentFixture<TestResourceViewComponent>;

  const spyObj = {
    v2: {
      values: jasmine.createSpyObj('values', ['updateValue', 'getValue']),
      res: jasmine.createSpyObj('res', ['getResource'])
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResourceViewComponent,
        PropertyViewComponent,
        DisplayEditComponent,
        TestResourceViewComponent,
        TestPropertyViewComponent,
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
          useValue: spyObj
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestResourceViewComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();

    expect(testHostComponent).toBeTruthy();
  });

  it('should get a resource', () => {

    const resSpy = TestBed.get(KnoraApiConnectionToken);

    resSpy.v2.res.getResource.and.callFake(
      () => {
        let iri: string;

        iri = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';

        return of(iri);
      }
    );

    expect(resSpy.v2.res.getResource).toHaveBeenCalledTimes(1);
    expect(resSpy.v2.res.getResource).toHaveBeenCalledWith(testHostComponent.iri);
  });
});
