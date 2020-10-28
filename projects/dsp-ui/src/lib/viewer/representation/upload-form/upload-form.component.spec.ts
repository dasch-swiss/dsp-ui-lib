import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UploadFormComponent } from './upload-form.component';

describe('UploadFormComponent', () => {
    let component: UploadFormComponent;
    let fixture: ComponentFixture<UploadFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [ UploadFormComponent ],
        imports: [
            BrowserAnimationsModule,
            HttpClientModule,
            MatInputModule,
            MatSnackBarModule
        ],
        providers: [ FormBuilder ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
