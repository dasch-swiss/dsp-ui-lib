import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPlaygroundComponent } from './upload-playground.component';

describe('UploadPlaygroundComponent', () => {
  let component: UploadPlaygroundComponent;
  let fixture: ComponentFixture<UploadPlaygroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPlaygroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
