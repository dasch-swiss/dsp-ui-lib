import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTestComponent } from './input-test.component';
import { Component, OnInit } from '@angular/core';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
    <app-input-test [myFirstInput]="'dada'"></app-input-test>`
})
class TestHostComponent implements OnInit {

    ngOnInit() {

    }
}

fdescribe('InputTestComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputTestComponent, TestHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
