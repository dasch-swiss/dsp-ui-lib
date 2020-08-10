import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovingImagePreviewComponent } from './moving-image-preview.component';

describe('MovingImagePreviewComponent', () => {
  let component: MovingImagePreviewComponent;
  let fixture: ComponentFixture<MovingImagePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovingImagePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovingImagePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
