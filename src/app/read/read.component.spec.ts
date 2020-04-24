import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadComponent } from './read.component';
import { KnoraApiConnectionToken } from 'knora-ui';
import { of } from 'rxjs';
import { Input, Component } from '@angular/core';

@Component({
  selector: `kui-resource-view`,
  template: ``
})
class TestResourceViewerComponent {

  @Input() iri;

}

describe('ReadComponent', () => {
  let component: ReadComponent;
  let fixture: ComponentFixture<ReadComponent>;

  beforeEach(async(() => {
    const authSpyObj = {
      v2: {
        auth: jasmine.createSpyObj('auth', ['logout'])
      }
    };

    TestBed.configureTestingModule({
      declarations: [ ReadComponent, TestResourceViewerComponent ],
      providers: [
        {
          provide: KnoraApiConnectionToken,
          useValue: authSpyObj
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    const authSpy = TestBed.get(KnoraApiConnectionToken);
        
    authSpy.v2.auth.logout.and.returnValue(
      of({})
    );

    fixture = TestBed.createComponent(ReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
