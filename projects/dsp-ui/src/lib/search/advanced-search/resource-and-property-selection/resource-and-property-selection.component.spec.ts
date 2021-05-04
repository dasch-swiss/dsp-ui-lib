import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceAndPropertySelectionComponent } from './resource-and-property-selection.component';

describe('ResourceAndPropertySelectionComponent', () => {
  let component: ResourceAndPropertySelectionComponent;
  let fixture: ComponentFixture<ResourceAndPropertySelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceAndPropertySelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceAndPropertySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
