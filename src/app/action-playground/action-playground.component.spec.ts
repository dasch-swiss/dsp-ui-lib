import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatListModule } from '@angular/material/list';
import { RouterTestingModule } from '@angular/router/testing';
import { DspActionModule, DspApiConnectionToken } from '@dasch-swiss/dsp-ui';
import { ActionPlaygroundComponent } from './action-playground.component';
import { ApiResponseData, AuthenticationEndpointV2, LoginResponse } from '@dasch-swiss/dsp-js';
import { of } from 'rxjs';

describe('ActionPlaygroundComponent', () => {
  let component: ActionPlaygroundComponent;
  let fixture: ComponentFixture<ActionPlaygroundComponent>;

  beforeEach(async(() => {
      const authSpyObj = {
          v2: {
              auth: jasmine.createSpyObj('auth', ['login'])
          }
      };

    TestBed.configureTestingModule({
        imports: [ DspActionModule, MatListModule, RouterTestingModule ],
        declarations: [ ActionPlaygroundComponent ],
        providers: [
            {
                provide: DspApiConnectionToken,
                useValue: authSpyObj
            }
        ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
      const authSpy = TestBed.inject(DspApiConnectionToken);

      (authSpy.v2.auth as jasmine.SpyObj<AuthenticationEndpointV2>).login.and.returnValue(
          of({} as ApiResponseData<LoginResponse>)
      );
      
    fixture = TestBed.createComponent(ActionPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
