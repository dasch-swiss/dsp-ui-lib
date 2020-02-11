import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DisplayEditComponent} from './display-edit.component';
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MockResource, ReadTextValueAsString, ReadValue} from '@knora/api';

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
class TestIntValueComponent {

  @Input() mode;

  @Input() displayValue;
}

/**
 * Test host component to simulate parent component.
 */
@Component({
  selector: `lib-host-component`,
  template: `
    <lib-display-edit #displayEditVal [displayValue]="readValue"></lib-display-edit>`
})
class TestHostDisplayValueComponent implements OnInit {

  @ViewChild('displayEditVal', {static: false}) displayEditValueComponent: DisplayEditComponent;

  readValue: ReadValue;

  mode: 'read' | 'update' | 'create' | 'search';

  ngOnInit() {

    MockResource.getTestthing().subscribe(res => {
      this.readValue =
        res[0].getValues('http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger')[0];

      this.mode = 'read';
    });

  }
}

describe('DisplayEditComponent', () => {
  let testHostComponent: TestHostDisplayValueComponent;
  let testHostFixture: ComponentFixture<TestHostDisplayValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayEditComponent, TestHostDisplayValueComponent, TestTextValueAsStringComponent, TestIntValueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostDisplayValueComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();

    expect(testHostComponent).toBeTruthy();
  });

  it('should create', () => {
    expect(testHostComponent.displayEditValueComponent).toBeTruthy();
  });
});
