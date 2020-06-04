import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatListModule } from '@angular/material/list';
import { DspActionModule } from '@dasch-swiss/dsp-ui';
import { ActionPlaygroundComponent } from './action-playground.component';

describe('ActionPlaygroundComponent', () => {
  let component: ActionPlaygroundComponent;
  let fixture: ComponentFixture<ActionPlaygroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ DspActionModule, MatListModule ],
        declarations: [ ActionPlaygroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
