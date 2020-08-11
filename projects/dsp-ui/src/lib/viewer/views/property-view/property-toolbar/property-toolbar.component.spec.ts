import { ClipboardModule } from '@angular/cdk/clipboard';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DspApiConnectionToken } from 'projects/dsp-ui/src/lib/core';
import { PropertyToolbarComponent } from './property-toolbar.component';

describe('PropertyToolbarComponent', () => {
    let component: PropertyToolbarComponent;
    let fixture: ComponentFixture<PropertyToolbarComponent>;

    beforeEach(async(() => {

        const userSpyObj = {
            admin: {
                usersEndpoint: jasmine.createSpyObj('usersEndpoint', ['getUserByIri'])
            }
        };
        const projectSpyObj = {
            admin: {
                projectsEndpoint: jasmine.createSpyObj('projectsEndpoint', ['getProjectByIri'])
            }
        };

        TestBed.configureTestingModule({
            declarations: [
                PropertyToolbarComponent
            ],
            imports: [
                ClipboardModule,
                MatIconModule,
                MatMenuModule,
                MatSnackBarModule,
                MatTooltipModule,
            ],
            providers: [
                {
                    provide: DspApiConnectionToken,
                    useValue: userSpyObj
                },
                {
                    provide: DspApiConnectionToken,
                    useValue: projectSpyObj
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertyToolbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });


    // TODO: currently not possible to test copy to clipboard from Material Angular
    // https://stackoverflow.com/questions/60337742/test-copy-to-clipboard-function
});
