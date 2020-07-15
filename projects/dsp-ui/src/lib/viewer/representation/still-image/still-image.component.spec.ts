import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StillImageComponent } from './still-image.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

describe('StillImageComponent', () => {
    let component: StillImageComponent;
    let fixture: ComponentFixture<StillImageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StillImageComponent],
            imports: [
                MatIconModule,
                MatToolbarModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StillImageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
