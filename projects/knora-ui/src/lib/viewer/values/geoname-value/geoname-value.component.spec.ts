import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadGeonameValue, MockResource, UpdateGeonameValue, CreateGeonameValue } from '@knora/api';
import { OnInit, Component, ViewChild, DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { GeonameValueComponent } from './geoname-value.component';

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <kui-geoname-value #inputVal [displayValue]="displayInputVal" [mode]="mode"></kui-geoname-value>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('inputVal', { static: false }) inputValueComponent: GeonameValueComponent;

  displayInputVal: ReadGeonameValue;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      const inputVal: ReadGeonameValue =
        res[0].getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasGeoname', ReadGeonameValue)[0];

      this.displayInputVal = inputVal;

      this.mode = 'read';
    });

  }
}

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <kui-geoname-value #inputVal [mode]="mode"></kui-geoname-value>`
})
class TestHostCreateValueComponent implements OnInit {

  @ViewChild('inputVal', { static: false }) inputValueComponent: GeonameValueComponent;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    this.mode = 'create';

  }
}

describe('GeonameValueComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GeonameValueComponent,
        TestHostDisplayValueComponent,
        TestHostCreateValueComponent
      ],
       imports: [
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
    })
      .compileComponents();
  }));

  describe('display and edit an integer value', () => {
    let testHostComponent: TestHostDisplayValueComponent;
    let testHostFixture: ComponentFixture<TestHostDisplayValueComponent>;
    let valueComponentDe: DebugElement;
    let valueInputDebugElement: DebugElement;
    let valueInputNativeElement;
    let commentInputDebugElement: DebugElement;
    let commentInputNativeElement;

    beforeEach(() => {
      testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
      testHostComponent = testHostFixture.componentInstance;
      testHostFixture.detectChanges();

      expect(testHostComponent).toBeTruthy();
      expect(testHostComponent.inputValueComponent).toBeTruthy();

      const hostCompDe = testHostFixture.debugElement;
      valueComponentDe = hostCompDe.query(By.directive(GeonameValueComponent));
      valueInputDebugElement = valueComponentDe.query(By.css('input.value'));
      valueInputNativeElement = valueInputDebugElement.nativeElement;

      commentInputDebugElement = valueComponentDe.query(By.css('input.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;
    });

    it('should display an existing value', () => {

      expect(testHostComponent.inputValueComponent.displayValue.geoname).toEqual("2661604");

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      expect(testHostComponent.inputValueComponent.mode).toEqual('read');

      expect(valueInputNativeElement.value).toEqual('2661604');

      expect(valueInputNativeElement.readOnly).toEqual(true);

    });
  });
});
