import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFormComponent } from './login-form.component';
import { DspApiConnectionToken } from '../../../core';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async(() => {
    const dspConnSpy = {
        admin: {
            usersEndpoint: jasmine.createSpyObj('usersEndpoint', ['getUser'])
        },
        v2: {
            auth: jasmine.createSpyObj('auth', ['checkCredentials', 'login']),
            jsonWebToken: ''
        },

    };

    TestBed.configureTestingModule({
      declarations: [ LoginFormComponent ],
      providers: [
        {
            provide: DspApiConnectionToken,
            useValue: dspConnSpy
        },
        FormBuilder,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
