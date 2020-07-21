import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StringLiteralInputComponent } from './string-literal-input.component';


describe('StringLiteralInputComponent', () => {
  let component: StringLiteralInputComponent;
  let fixture: ComponentFixture<StringLiteralInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [ StringLiteralInputComponent ],
        imports: [
            MatMenuModule,
            MatInputModule,
            MatIconModule,
            MatButtonToggleModule,
            MatFormFieldModule,
            BrowserAnimationsModule,
            ReactiveFormsModule
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StringLiteralInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
