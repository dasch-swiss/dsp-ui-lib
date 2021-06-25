import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedResourcesComponent } from './selected-resources.component';

describe('SelectedResourcesComponent', () => {
  let component: SelectedResourcesComponent;
  let fixture: ComponentFixture<SelectedResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedResourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
