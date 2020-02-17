import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {Interval, IntervalInputComponent} from './interval-input.component';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Component, OnInit, ViewChild} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <div [formGroup]="form">
    <mat-form-field>
        <kui-interval-input #intervalInput [formControlName]="'interval'"></kui-interval-input>
    </mat-form-field>
    </div>`
})
class TestHostComponent implements OnInit {

  @ViewChild('intervalInput', {static: false}) intervalInputComponent: IntervalInputComponent;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      interval: [new Interval(1, 2)]
    });

  }
}

describe('InvertalInputComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatFormFieldModule, BrowserAnimationsModule],
      declarations: [IntervalInputComponent, TestHostComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();

    expect(testHostComponent).toBeTruthy();
    expect(testHostComponent.intervalInputComponent).toBeTruthy();
  });

  it('should create', () => {
    expect(testHostComponent.intervalInputComponent).toBeTruthy();
  });
});
