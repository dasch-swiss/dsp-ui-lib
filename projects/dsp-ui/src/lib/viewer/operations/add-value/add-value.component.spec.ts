import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddValueComponent } from './add-value.component';

describe('AddValueComponent', () => {
  let component: AddValueComponent;
  let fixture: ComponentFixture<AddValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
