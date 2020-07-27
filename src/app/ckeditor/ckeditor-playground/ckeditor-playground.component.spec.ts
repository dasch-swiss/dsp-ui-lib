import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CkeditorPlaygroundComponent } from './ckeditor-playground.component';

describe('CkeditorPlaygroundComponent', () => {
  let component: CkeditorPlaygroundComponent;
  let fixture: ComponentFixture<CkeditorPlaygroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CkeditorPlaygroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CkeditorPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
