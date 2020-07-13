import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import {
    ApiResponseError,
    IHasPropertyWithPropertyDefinition,
    MockResource,
    ReadResource,
    ReadValue,
    ResourcePropertyDefinition,
    SystemPropertyDefinition
} from '@dasch-swiss/dsp-js';
import { PropertyInfoValues } from '../resource-view/resource-view.component';
import { PropertyViewComponent } from './property-view.component';
import { ValueOperationEventService } from '../../services/event-bus.service';

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <dsp-property-view #propView
      [parentResource]="parentResource"
      [propArray]="propArray"
      [systemPropArray]="systemPropArray">
    </dsp-property-view>`
})
class TestPropertyParentComponent implements OnInit {

  @ViewChild('propView') propertyViewComponent: PropertyViewComponent;

  parentResource: ReadResource;

  propArray: PropertyInfoValues[] = [];

  systemPropArray: SystemPropertyDefinition[] = [];

  ngOnInit() {

    MockResource.getTestthing().subscribe(response => {
        this.parentResource = response;

        // gather resource property information
        this.propArray = this.parentResource.entityInfo.classes[this.parentResource.type].getResourcePropertiesList().map(
            (prop: IHasPropertyWithPropertyDefinition) => {
                const propInfoAndValues: PropertyInfoValues = {
                    propDef: prop.propertyDefinition,
                    guiDef: prop,
                    values: this.parentResource.getValues(prop.propertyIndex)
                };
                return propInfoAndValues;
            }
        );

        // sort properties by guiOrder
        this.propArray.sort((a, b) => (a.guiDef.guiOrder > b.guiDef.guiOrder) ? 1 : -1);

        // get system property information
        this.systemPropArray = this.parentResource.entityInfo.getPropertyDefinitionsByType(SystemPropertyDefinition);

    },
    (error: ApiResponseError) => {
        console.error('Error to get the mock resource', error);
    }
    );

  }
}

/**
 * Test host component to simulate child component, here display-edit.
 */
@Component({
  selector: `dsp-display-edit`,
  template: ``
})
class TestDisplayValueComponent {

  @Input() parentResource: ReadResource;
  @Input() displayValue: ReadValue;
  @Input() configuration?: object;

}

/**
 * Test host component to simulate child component, here add-value.
 */
@Component({
    selector: `dsp-add-value`,
    template: ``
  })
  class TestAddValueComponent {

    @Input() parentResource: ReadResource;
    @Input() resourcePropertyDefinition: ResourcePropertyDefinition;

  }

describe('PropertyViewComponent', () => {
  let testHostComponent: TestPropertyParentComponent;
  let testHostFixture: ComponentFixture<TestPropertyParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
      ],
      declarations: [
        TestPropertyParentComponent,
        TestDisplayValueComponent,
        TestAddValueComponent,
        PropertyViewComponent
      ],
      providers: [ValueOperationEventService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestPropertyParentComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();

    expect(testHostComponent).toBeTruthy();
  });


  it('should get 25 properties', () => {

    expect(testHostComponent.propArray).toBeTruthy();
    expect(testHostComponent.propArray.length).toBe(25);

  });

  it('should get the resource testding', () => {

    expect(testHostComponent.parentResource).toBeTruthy();
    expect(testHostComponent.parentResource.id).toEqual('http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw');
    expect(testHostComponent.parentResource.label).toEqual('testding');

  });

  it('should display a text value among the property list', () => {

    expect(testHostComponent.propArray[4].propDef.label).toEqual('Text');
    expect(testHostComponent.propArray[4].propDef.comment).toBe(undefined);
    expect(testHostComponent.propArray[4].guiDef.cardinality).toEqual(2);
    expect(testHostComponent.propArray[4].guiDef.guiOrder).toEqual(2);
    expect(testHostComponent.propArray[4].values[0].type).toEqual('http://api.knora.org/ontology/knora-api/v2#TextValue');

  });

  it('should get some system properties', () => {

    expect(testHostComponent.systemPropArray).toBeTruthy();
    expect(testHostComponent.systemPropArray.length).toEqual(13);

    // check if the first system property is an ARK url
    expect(testHostComponent.systemPropArray[0].label).toEqual('ARK URL');

  });

  describe('Add value', () => {
    let hostCompDe;
    let propertyViewComponentDe;

    beforeEach(() => {
        expect(testHostComponent.propertyViewComponent).toBeTruthy();

        hostCompDe = testHostFixture.debugElement;

        propertyViewComponentDe = hostCompDe.query(By.directive(PropertyViewComponent));

        expect(testHostComponent).toBeTruthy();

        testHostComponent.propertyViewComponent.addButtonIsVisible = true;
        testHostComponent.propertyViewComponent.addValueFormIsVisible = false;
        testHostFixture.detectChanges();
    });

    it('should show an add button under each property that has a value component and for which the cardinality is not 1', () => {
        const addButtons = propertyViewComponentDe.queryAll(By.css('button.create'));
        expect(addButtons.length).toEqual(14);

    });

    it('should show an add value component when the add button is clicked', () => {
        const addButtonDebugElement = propertyViewComponentDe.query(By.css('button.create'));
        const addButtonNativeElement = addButtonDebugElement.nativeElement;

        expect(propertyViewComponentDe.query(By.css('.add-value'))).toBeNull();

        addButtonNativeElement.click();

        testHostFixture.detectChanges();

        expect(propertyViewComponentDe.query(By.css('button.create'))).toBeNull();

        expect(propertyViewComponentDe.query(By.css('.add-value'))).toBeDefined();

    });
  });

});
