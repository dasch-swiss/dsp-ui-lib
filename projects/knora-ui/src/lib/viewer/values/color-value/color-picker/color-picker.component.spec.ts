import { Component, OnInit, ViewChild, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerComponent } from './color-picker.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
import { By } from '@angular/platform-browser';

/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
    <div [formGroup]="form">
      <mat-form-field>
        <kui-color-picker #colorInput [formControlName]="'colorValue'" [readonly]="mode === 'read'"></kui-color-picker>
      </mat-form-field>
    </div>`
})
class TestHostComponent implements OnInit {

  @ViewChild('colorInput', { static: false }) colorPickerComponent: ColorPickerComponent;

  form: FormGroup;

  readonly = false;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      colorValue: '#901453'
    });

  }
}

describe('ColorPickerComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;

  let colorPickerComponentDe: DebugElement;
  let colorInputDebugElement: DebugElement;
  let colorInputNativeElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ColorPickerModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule],
      declarations: [ColorPickerComponent, TestHostComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();

    expect(testHostComponent).toBeTruthy();
    expect(testHostComponent.colorPickerComponent).toBeTruthy();
    expect(testHostComponent.colorPickerComponent.readonly).toBeFalsy();

    const hostCompDe = testHostFixture.debugElement;
    colorPickerComponentDe = hostCompDe.query(By.directive(ColorPickerComponent));
    colorInputDebugElement = colorPickerComponentDe.query(By.css('input.color'));
    colorInputNativeElement = colorInputDebugElement.nativeElement;

    expect(colorInputNativeElement.readOnly).toBe(true);
  });

  it('should initialize the color correctly', () => {
    expect(colorInputNativeElement.value).toEqual('#901453');
  });

  it('should propagate changes made by the user', () => {

    colorInputNativeElement.value = '#f1f1f1';
    colorInputNativeElement.dispatchEvent(new Event('input'));

    testHostFixture.detectChanges();

    expect(testHostComponent.form.controls.colorValue).toBeTruthy();
    expect(testHostComponent.form.controls.colorValue.value.color).toEqual('#f1f1f1');

  });

  it('should return "null" for an empty (invalid) input', () => {

    colorInputNativeElement.value = '';
    colorInputNativeElement.dispatchEvent(new Event('input'));

    testHostFixture.detectChanges();

    expect(testHostComponent.form.controls.colorValue.value.color).toEqual('');
  });

  it('should be readonly when the readonly input is set to true', () => {
    testHostComponent.readonly = true;

    testHostFixture.detectChanges();

    expect(colorInputNativeElement.readOnly).toBe(true);
  });

});
