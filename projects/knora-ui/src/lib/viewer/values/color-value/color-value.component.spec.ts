import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorValueComponent } from './color-value.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ColorPickerModule } from 'ngx-color-picker';

describe('ColorValueComponent', () => {
  let component: ColorValueComponent;
  let fixture: ComponentFixture<ColorValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, ColorPickerModule],
      declarations: [ColorValueComponent, ColorPickerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
