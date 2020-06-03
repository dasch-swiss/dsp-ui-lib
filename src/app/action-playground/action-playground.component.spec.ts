import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspActionModule } from '@dasch-swiss/dsp-ui/lib/action';
import { ActionPlaygroundComponent } from './action-playground.component';

describe('ActionPlaygroundComponent', () => {
  let component: ActionPlaygroundComponent;
  let fixture: ComponentFixture<ActionPlaygroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ DspActionModule],
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
