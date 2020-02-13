import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntValueComponent } from './int-value.component';
import { ReadIntValue, MockResource } from '@knora/api';
import { OnInit, Component, ViewChild, DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { $ } from 'protractor';
import { By } from '@angular/platform-browser';

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <kui-int-value #inputVal [displayValue]="displayInputVal" [mode]="mode"></kui-int-value>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('inputVal', {static: false}) inputValueComponent: IntValueComponent;

  displayInputVal: ReadIntValue;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      const inputVal: ReadIntValue =
        res[0].getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger', ReadIntValue)[0];

      this.displayInputVal = inputVal;

      this.mode = 'read';
    });

  }
}

describe('IntValueComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        IntValueComponent,
        TestHostDisplayValueComponent
       ],
       imports: [
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
    })
    .compileComponents();
  }));
  
  fdescribe('display and edit an integer value', () => {
    let testHostComponent: TestHostDisplayValueComponent;
    let testHostFixture: ComponentFixture<TestHostDisplayValueComponent>;
    let valueComponentDe: DebugElement;
    let valueInputDebugElement: DebugElement;
    let valueInputNativeElement;

    beforeEach(() => {
      testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
      testHostComponent = testHostFixture.componentInstance;
      testHostFixture.detectChanges();

      expect(testHostComponent).toBeTruthy();
      expect(testHostComponent.inputValueComponent).toBeTruthy();

      const hostCompDe = testHostFixture.debugElement;
      valueComponentDe = hostCompDe.query(By.directive(IntValueComponent));
      valueInputDebugElement = valueComponentDe.query(By.css('input.value'));
      valueInputNativeElement = valueInputDebugElement.nativeElement;
    });

    it('should display an existing value', () => {

      expect(testHostComponent.inputValueComponent.displayValue.int).toEqual(1);

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      expect(valueInputNativeElement.value).toEqual('1');

      expect(valueInputNativeElement.readOnly).toEqual(true);

    });
  });
});
