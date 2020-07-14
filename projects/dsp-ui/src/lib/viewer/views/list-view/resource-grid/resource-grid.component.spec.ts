import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceGridComponent } from './resource-grid.component';

describe('ResourceGridComponent', () => {
  let component: ResourceGridComponent;
  let fixture: ComponentFixture<ResourceGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
