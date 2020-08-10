import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvTimelineComponent } from './av-timeline.component';

describe('AvTimelineComponent', () => {
  let component: AvTimelineComponent;
  let fixture: ComponentFixture<AvTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
