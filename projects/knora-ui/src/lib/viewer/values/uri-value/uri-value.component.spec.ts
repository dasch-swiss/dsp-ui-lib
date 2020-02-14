import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UriValueComponent } from './uri-value.component';
import { ReadUriValue, MockResource, UpdateValue, UpdateUriValue, CreateUriValue } from '@knora/api';
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
    <kui-uri-value #inputVal [displayValue]="displayInputVal" [mode]="mode"></kui-uri-value>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('inputVal', {static: false}) inputValueComponent: UriValueComponent;

  displayInputVal: ReadUriValue;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      const inputVal: ReadUriValue =
        res[0].getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasUri', ReadUriValue)[0];

      this.displayInputVal = inputVal;

      this.mode = 'read';
    });

  }
}

describe('UriValueComponent', () => {
  let component: UriValueComponent;
  let fixture: ComponentFixture<UriValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        UriValueComponent,
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

  fdescribe('display and edit a Uri value', () => {
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
      valueComponentDe = hostCompDe.query(By.directive(UriValueComponent));
      valueInputDebugElement = valueComponentDe.query(By.css('input.value'));
      valueInputNativeElement = valueInputDebugElement.nativeElement;

      commentInputDebugElement = valueComponentDe.query(By.css('input.comment'));
      commentInputNativeElement = commentInputDebugElement.nativeElement;
    });

    it('should display an existing value', () => {

      expect(testHostComponent.inputValueComponent.displayValue.uri).toEqual('http://www.google.ch');

      expect(testHostComponent.inputValueComponent.form.valid).toBeTruthy();

      expect(testHostComponent.inputValueComponent.mode).toEqual('read');

      expect(valueInputNativeElement.value).toEqual('http://www.google.ch');

      expect(valueInputNativeElement.readOnly).toEqual(true);

    });

  });
});
