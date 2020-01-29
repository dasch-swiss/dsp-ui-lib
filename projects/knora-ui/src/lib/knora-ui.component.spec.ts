import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnoraUiComponent } from './knora-ui.component';

describe('KnoraUiComponent', () => {
  let component: KnoraUiComponent;
  let fixture: ComponentFixture<KnoraUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnoraUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnoraUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
