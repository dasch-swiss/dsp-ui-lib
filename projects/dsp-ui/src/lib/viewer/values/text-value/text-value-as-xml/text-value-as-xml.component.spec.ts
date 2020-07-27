import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextValueAsXMLComponent } from './text-value-as-xml.component';

describe('TextValueAsXMLComponent', () => {
  let component: TextValueAsXMLComponent;
  let fixture: ComponentFixture<TextValueAsXMLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextValueAsXMLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextValueAsXMLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
