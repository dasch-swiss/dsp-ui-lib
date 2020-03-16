import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { DisplayEditComponent } from '../../operations/display-edit/display-edit.component';
import { BooleanValueComponent } from '../../values/boolean-value/boolean-value.component';
import { ColorPickerComponent } from '../../values/color-value/color-picker/color-picker.component';
import { ColorValueComponent } from '../../values/color-value/color-value.component';
import { DecimalValueComponent } from '../../values/decimal-value/decimal-value.component';
import { IntValueComponent } from '../../values/int-value/int-value.component';
import { IntervalValueComponent } from '../../values/interval-value/interval-value.component';
import { TextValueAsStringComponent } from '../../values/text-value/text-value-as-string/text-value-as-string.component';
import { UriValueComponent } from '../../values/uri-value/uri-value.component';
import { PropertyViewComponent } from './property-view.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ReadResource, ReadValue, MockResource, IHasProperty, ResourcePropertyDefinition } from '@knora/api';
import { PropertyInfoValues } from '../resource-view/resource-view.component';

/**
 * Test host component to simulate property-view component.
 */
@Component({
  selector: `kui-property-view`,
  template: `
    <kui-property-view #propView [resource]="resource" [propArray]="propArray"></kui-property-view>`
})
class TestPropertyViewComponent implements OnInit {

  @ViewChild('propView', { static: false }) propertyViewComponent: PropertyViewComponent;

  resource: ReadResource;

  propArray: PropertyInfoValues[] = [];

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
  selector: `kui-display-edit`,
  template: `
    <kui-display-edit #displayEditVal [parentResource]="readResource" [displayValue]="readValue"></kui-display-edit>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('displayEditVal', { static: false }) displayEditValueComponent: DisplayEditComponent;

  readResource: ReadResource;
  readValue: ReadValue;

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      this.readResource = res[0];
      const readVal =
        this.readResource.getValues('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger')[0];

      this.readValue = readVal;

    });

  }
}

fdescribe('PropertyViewComponent', () => {
  let testHostComponent: TestPropertyViewComponent;
  let testHostFixture: ComponentFixture<TestPropertyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        /* DisplayEditComponent,
        BooleanValueComponent,
        ColorValueComponent,
        ColorPickerComponent,
        DecimalValueComponent,
        IntValueComponent,
        IntervalValueComponent,
        TextValueAsStringComponent,
        UriValueComponent, */
        TestPropertyViewComponent,
        TestHostDisplayValueComponent
      ],
      imports: [
        ReactiveFormsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        ColorPickerModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestPropertyViewComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();
  });

  fit('should create', () => {
    expect(testHostComponent).toBeTruthy();
  });
});
