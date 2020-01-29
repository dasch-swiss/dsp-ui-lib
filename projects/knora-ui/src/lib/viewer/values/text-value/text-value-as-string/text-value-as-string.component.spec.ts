import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextValueAsStringComponent } from './text-value-as-string.component';

describe('TextValueAsStringComponent', () => {
  let component: TextValueAsStringComponent;
  let fixture: ComponentFixture<TextValueAsStringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextValueAsStringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextValueAsStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
