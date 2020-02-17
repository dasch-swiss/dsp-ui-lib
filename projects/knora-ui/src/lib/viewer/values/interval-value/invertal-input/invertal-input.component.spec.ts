import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvertalInputComponent } from './invertal-input.component';

describe('InvertalInputComponent', () => {
  let component: InvertalInputComponent;
  let fixture: ComponentFixture<InvertalInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvertalInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvertalInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
