import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSearchPlaygroundComponent } from './advanced-search-playground.component';
import { Component, OnInit } from '@angular/core';

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: 'dsp-advanced-search',
    template: ``
})
class TestHostComponent {}

describe('AdvancedSearchPlaygroundComponent', () => {
  let component: AdvancedSearchPlaygroundComponent;
  let fixture: ComponentFixture<AdvancedSearchPlaygroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedSearchPlaygroundComponent, TestHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSearchPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
