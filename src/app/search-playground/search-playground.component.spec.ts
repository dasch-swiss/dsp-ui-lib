import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPlaygroundComponent } from './search-playground.component';

describe('SearchPlaygroundComponent', () => {
  let component: SearchPlaygroundComponent;
  let fixture: ComponentFixture<SearchPlaygroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPlaygroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
