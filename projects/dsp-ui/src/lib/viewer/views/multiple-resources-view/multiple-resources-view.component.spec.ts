import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleResourcesViewComponent } from './multiple-resources-view.component';

describe('MultipleResourcesViewComponent', () => {
  let component: MultipleResourcesViewComponent;
  let fixture: ComponentFixture<MultipleResourcesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleResourcesViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleResourcesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
