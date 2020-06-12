import { OverlayModule } from '@angular/cdk/overlay';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DspApiConnectionToken } from '../../core';
import { FulltextSearchComponent } from './fulltext-search.component';


describe('FulltextSearchComponent', () => {
  let component: FulltextSearchComponent;
  let fixture: ComponentFixture<FulltextSearchComponent>;

  const spyObj = {
    v2: {
      res: jasmine.createSpyObj('projectsEndpoint', ['getProjects'])
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FulltextSearchComponent ],
      imports: [OverlayModule, RouterTestingModule],
      providers: [
        {
          provide: DspApiConnectionToken,
          useValue: spyObj
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FulltextSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
