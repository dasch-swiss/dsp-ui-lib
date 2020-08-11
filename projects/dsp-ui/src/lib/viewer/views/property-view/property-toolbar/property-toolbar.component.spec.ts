import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyToolbarComponent } from './property-toolbar.component';

describe('PropertyToolbarComponent', () => {
  let component: PropertyToolbarComponent;
  let fixture: ComponentFixture<PropertyToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
