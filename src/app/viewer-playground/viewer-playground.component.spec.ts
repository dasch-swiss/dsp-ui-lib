import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerPlaygroundComponent } from './viewer-playground.component';

describe('ViewerPlaygroundComponent', () => {
  let component: ViewerPlaygroundComponent;
  let fixture: ComponentFixture<ViewerPlaygroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewerPlaygroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
