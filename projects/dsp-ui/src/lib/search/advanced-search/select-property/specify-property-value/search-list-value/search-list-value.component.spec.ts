import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchListValueComponent } from './search-list-value.component';

xdescribe('SearchListValueComponent', () => {
  let component: SearchListValueComponent;
  let fixture: ComponentFixture<SearchListValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchListValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchListValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
