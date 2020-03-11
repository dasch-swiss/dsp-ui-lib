import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextValueAsHtmlComponent } from './text-value-as-html.component';

describe('TextValueAsHtmlComponent', () => {
  let component: TextValueAsHtmlComponent;
  let fixture: ComponentFixture<TextValueAsHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextValueAsHtmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextValueAsHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
