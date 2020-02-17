import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IntervalValueComponent} from './interval-value.component';
import {Component, OnInit, ViewChild} from "@angular/core";
import {IntValueComponent} from "../int-value/int-value.component";
import {MockResource, ReadIntervalValue, ReadIntValue} from "@knora/api";
import {ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatInputModule} from "@angular/material/input";
import {IntervalInputComponent} from "./interval-input/interval-input.component";

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <kui-interval-value #inputVal [displayValue]="displayInputVal" [mode]="mode"></kui-interval-value>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('inputVal', {static: false}) inputValueComponent: IntValueComponent;

  displayInputVal: ReadIntervalValue;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      const inputVal: ReadIntervalValue =
        res[0].getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInterval', ReadIntervalValue)[0];

      this.displayInputVal = inputVal;

      this.mode = 'read';
    });

  }
}


describe('IntervalValueComponent', () => {
  let testHostComponent: TestHostDisplayValueComponent;
  let testHostFixture: ComponentFixture<TestHostDisplayValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntervalValueComponent, TestHostDisplayValueComponent, IntervalInputComponent ],
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();

    expect(testHostComponent).toBeTruthy();
    expect(testHostComponent.inputValueComponent).toBeTruthy();
  });

  it('should create', () => {
    console.log(testHostComponent.inputValueComponent);
  });
});
