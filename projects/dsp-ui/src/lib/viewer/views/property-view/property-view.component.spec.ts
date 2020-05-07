import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IHasProperty, MockResource, PropertyDefinition, ReadResource, ReadValue, ResourcePropertyDefinition, SystemPropertyDefinition } from '@knora/api';
import { PropertyInfoValues } from '../resource-view/resource-view.component';
import { PropertyViewComponent } from './property-view.component';


/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <kui-property-view #propView
      [parentResource]="parentResource"
      [propArray]="propArray"
      [systemPropArray]="systemPropArray"
    ></kui-property-view>`
})
class TestPropertyParentComponent implements OnInit {

  @ViewChild('propView') propertyViewComponent: PropertyViewComponent;

  parentResource: ReadResource;

  propArray: PropertyInfoValues[] = [];

  systemPropArray?: PropertyDefinition[] = [];

  ngOnInit() {

    MockResource.getTestthing().subscribe(response => {
      this.parentResource = response[0];
      const propsList: IHasProperty[] = this.parentResource.entityInfo.classes[this.parentResource.type].propertiesList;

      for (const prop of propsList) {
        const index = prop.propertyIndex;

        if (this.parentResource.entityInfo.properties[index]) {
          if (this.parentResource.entityInfo.properties[index] instanceof ResourcePropertyDefinition) {
            // filter all properties by type ResourcePropertyDefinition
            const propInfoAndValues: PropertyInfoValues = {
              guiDef: prop,
              propDef: this.parentResource.entityInfo.properties[index],
              values: this.parentResource.properties[index]
            };

            this.propArray.push(propInfoAndValues);

          } else if (this.parentResource.entityInfo.properties[index] instanceof SystemPropertyDefinition) {
            // filter all properties by type SystemPropertyDefinition
            const systemPropInfo = this.parentResource.entityInfo.properties[index];

            this.systemPropArray.push(systemPropInfo);

          }

        } else {
          console.error('Error detected: the property with IRI =' + index + 'is not a property of the resource');
        }
      }
    }
    );

  }
}

/**
 * Test host component to simulate child component, here display-edit.
 */
@Component({
  selector: `kui-display-edit`,
  template: ``
})
class TestDisplayValueComponent {

  @Input() parentResource: ReadResource;
  @Input() displayValue: ReadValue;
  @Input() configuration?: object;

}

describe('PropertyViewComponent', () => {
  let testHostComponent: TestPropertyParentComponent;
  let testHostFixture: ComponentFixture<TestPropertyParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestPropertyParentComponent,
        TestDisplayValueComponent,
        PropertyViewComponent
      ]
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

    expect(testHostComponent.propArray[8].propDef.label).toEqual('Text');
    expect(testHostComponent.propArray[8].propDef.comment).toBe(undefined);
    expect(testHostComponent.propArray[8].guiDef.cardinality).toEqual(2);
    expect(testHostComponent.propArray[8].guiDef.guiOrder).toEqual(2);
    expect(testHostComponent.propArray[8].values[0].type).toEqual('http://api.knora.org/ontology/knora-api/v2#TextValue');

  });

  it('should get some system properties', () => {

    expect(testHostComponent.systemPropArray).toBeTruthy();
    expect(testHostComponent.systemPropArray.length).toEqual(14);

    // check if the first system property is an ARK url
    expect(testHostComponent.systemPropArray[0].label).toEqual('ARK URL');

  });


});
