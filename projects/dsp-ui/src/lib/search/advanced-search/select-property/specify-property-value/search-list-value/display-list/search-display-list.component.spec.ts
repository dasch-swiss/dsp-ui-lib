import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDisplayListComponent } from './search-display-list.component';

xdescribe('SearchDisplayListComponent', () => {
  let component: SearchDisplayListComponent;
  let fixture: ComponentFixture<SearchDisplayListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDisplayListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDisplayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
